import { Router } from "express";
import { Request, Response } from "express";
import { stripeService } from "../services/stripeService";
import { prisma, handlePrismaError } from "../lib/prisma";

const creators = Router();

// Start Stripe Connect onboarding for creator
creators.post("/onboard", async (req: Request, res: Response) => {
  try {
    const { creatorId, email, country = "CO" } = req.body;

    if (!creatorId || !email) {
      return res
        .status(400)
        .json({ error: "Creator ID and email are required" });
    }

    // Check if creator profile exists
    const creator = await prisma.profile.findUnique({
      where: { id: creatorId },
      select: {
        id: true,
        userId: true,
        username: true,
        role: true,
        stripeAccountId: true,
      },
    });

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    if (creator.role !== "CREATOR") {
      return res.status(403).json({ error: "Profile is not a creator" });
    }

    // Check if already has Stripe account
    if (creator.stripeAccountId) {
      // Get existing onboarding link if account exists but not complete
      const accountStatus = await stripeService.checkAccountStatus(
        creator.stripeAccountId,
      );

      if (!accountStatus.is_complete) {
        const onboardingLink = await stripeService.createConnectOnboardingLink(
          creator.stripeAccountId,
          creatorId,
        );
        return res.json({
          message: "Continue onboarding",
          onboarding_url: onboardingLink,
          account_status: accountStatus,
        });
      } else {
        return res.json({
          message: "Onboarding already completed",
          account_status: accountStatus,
        });
      }
    }

    // Create new Connect account
    const account = await stripeService.createConnectAccount(
      creatorId,
      email,
      country,
    );

    // Save Stripe account ID to profile
    await prisma.profile.update({
      where: { id: creatorId },
      data: { stripeAccountId: account.id },
    });

    // Generate onboarding link
    const onboardingLink = await stripeService.createConnectOnboardingLink(
      account.id,
      creatorId,
    );

    res.json({
      message: "Onboarding started",
      onboarding_url: onboardingLink,
      stripe_account_id: account.id,
    });
  } catch (error) {
    console.error("Error starting onboarding:", error);
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Check onboarding status
creators.get(
  "/onboard-status/:creatorId",
  async (req: Request, res: Response) => {
    try {
      const { creatorId } = req.params;

      // Get creator's Stripe account ID
      const creator = await prisma.profile.findUnique({
        where: { id: creatorId },
        select: {
          id: true,
          stripeAccountId: true,
          role: true,
        },
      });

      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }

      if (creator.role !== "CREATOR") {
        return res.status(403).json({ error: "Profile is not a creator" });
      }

      if (!creator.stripeAccountId) {
        return res.json({
          status: "not_started",
          message: "Onboarding not started",
          can_receive_payments: false,
        });
      }

      // Check Stripe account status
      const accountStatus = await stripeService.checkAccountStatus(
        creator.stripeAccountId,
      );

      res.json({
        status: accountStatus.is_complete ? "completed" : "pending",
        account_status: accountStatus,
        can_receive_payments: accountStatus.charges_enabled,
        can_receive_payouts: accountStatus.payouts_enabled,
      });
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      const dbError = handlePrismaError(error);
      res.status(500).json(dbError);
    }
  },
);

// Get creator dashboard data
creators.get("/dashboard/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { period = "30d" } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Get creator profile
    const creator = await prisma.profile.findUnique({
      where: { id: creatorId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        subscriptionPrice: true,
        stripeAccountId: true,
        totalEarnings: true,
        subscriberCount: true,
        role: true,
      },
    });

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    if (creator.role !== "CREATOR") {
      return res.status(403).json({ error: "Profile is not a creator" });
    }

    // Get earnings data
    const earnings = await prisma.creatorEarning.findMany({
      where: {
        creatorId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "desc" },
    });

    // Get subscriber count
    const subscriberCount = await prisma.subscription.count({
      where: {
        creatorId,
        isActive: true,
      },
    });

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { creatorId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Calculate totals
    const totalEarnings =
      earnings?.reduce((sum, e) => sum + e.totalNet, 0) || 0;
    const totalFees =
      earnings?.reduce((sum, e) => sum + e.platformFee + e.stripeFee, 0) || 0;

    // Get Stripe balance if has account
    let stripeBalance = null;
    if (creator.stripeAccountId) {
      try {
        const accountStatus = await stripeService.checkAccountStatus(
          creator.stripeAccountId,
        );
        if (accountStatus.is_complete) {
          stripeBalance = await stripeService.getBalance(
            creator.stripeAccountId,
          );
        }
      } catch (error) {
        console.error("Error fetching Stripe balance:", error);
      }
    }

    res.json({
      creator: {
        id: creator.id,
        name: creator.displayName,
        username: creator.username,
        avatar_url: creator.avatarUrl,
        subscription_price: creator.subscriptionPrice || 0,
      },
      stats: {
        total_earnings: totalEarnings / 100, // Convert cents to dollars
        total_fees: totalFees / 100,
        pending_balance: 0, // Can be calculated from pending transactions if needed
        subscriber_count: subscriberCount,
        transactions_count: earnings?.length || 0,
      },
      stripe_balance: stripeBalance
        ? {
            available: stripeBalance.total_available / 100,
            pending: stripeBalance.total_pending / 100,
          }
        : null,
      recent_transactions: recentTransactions || [],
      earnings_data: earnings || [],
    });
  } catch (error) {
    console.error("Error fetching creator dashboard:", error);
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Request payout
creators.post("/payout", async (req: Request, res: Response) => {
  try {
    const { creatorId, amount } = req.body;

    if (!creatorId || !amount || amount < 1000) {
      // Minimum $10.00
      return res
        .status(400)
        .json({ error: "Creator ID and amount (minimum $10.00) are required" });
    }

    // Get creator profile
    const creator = await prisma.profile.findUnique({
      where: { id: creatorId },
      select: {
        id: true,
        userId: true,
        stripeAccountId: true,
        role: true,
      },
    });

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    if (creator.role !== "CREATOR") {
      return res.status(403).json({ error: "Profile is not a creator" });
    }

    if (!creator.stripeAccountId) {
      return res
        .status(400)
        .json({ error: "Payout not available. Complete onboarding first." });
    }

    // Check account status
    const accountStatus = await stripeService.checkAccountStatus(
      creator.stripeAccountId,
    );

    if (!accountStatus.payouts_enabled) {
      return res
        .status(400)
        .json({
          error: "Payouts not enabled. Complete onboarding verification.",
        });
    }

    // Check available balance
    const stripeBalance = await stripeService.getBalance(
      creator.stripeAccountId,
    );

    if (stripeBalance.total_available < amount) {
      return res.status(400).json({
        error: "Insufficient balance",
        available: stripeBalance.total_available / 100,
        requested: amount / 100,
      });
    }

    // Create payout
    const payout = await stripeService.createPayout(
      creator.stripeAccountId,
      amount,
    );

    // Record payout in database
    await prisma.transaction.create({
      data: {
        buyerId: creator.userId,
        creatorId: creator.id,
        type: "TIP", // Prisma enum doesn't have PAYOUT, using TIP as placeholder
        amount,
        currency: "usd",
        status: payout.status === "paid" ? "COMPLETED" : "PENDING",
        stripePiId: payout.id,
        description: `Payout of $${amount / 100}`,
      },
    });

    res.json({
      message: "Payout initiated successfully",
      payout: {
        id: payout.id,
        amount: amount / 100,
        status: payout.status,
        arrival_date: payout.arrival_date
          ? new Date(payout.arrival_date * 1000)
          : null,
      },
    });
  } catch (error) {
    console.error("Error creating payout:", error);
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Update creator subscription price
creators.put("/subscription-price", async (req: Request, res: Response) => {
  try {
    const { creatorId, price } = req.body;

    if (!creatorId || !price || price < 499) {
      // Minimum $4.99
      return res
        .status(400)
        .json({ error: "Creator ID and price (minimum $4.99) are required" });
    }

    // Update creator's subscription price
    const updatedProfile = await prisma.profile.update({
      where: { id: creatorId },
      data: { subscriptionPrice: price },
      select: {
        id: true,
        username: true,
        displayName: true,
        subscriptionPrice: true,
        role: true,
      },
    });

    res.json({
      message: "Subscription price updated successfully",
      creator: updatedProfile,
      price: price / 100, // Return in dollars
    });
  } catch (error) {
    console.error("Error updating subscription price:", error);
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get creator's earnings history
creators.get("/earnings/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Get earnings with pagination
    const [earnings, total] = await Promise.all([
      prisma.creatorEarning.findMany({
        where: { creatorId },
        orderBy: { date: "desc" },
        skip,
        take,
      }),
      prisma.creatorEarning.count({
        where: { creatorId },
      }),
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      earnings: earnings || [],
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching earnings history:", error);
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get payout history
creators.get("/payouts/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Get payouts (filter by description containing "Payout")
    const [payouts, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          creatorId,
          description: {
            contains: "Payout",
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.transaction.count({
        where: {
          creatorId,
          description: {
            contains: "Payout",
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      payouts: payouts || [],
      pagination: {
        page: Number(page),
        limit: take,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching payout history:", error);
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

export { creators };
