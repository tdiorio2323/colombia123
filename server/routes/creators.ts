import { Router } from "express";
import { Request, Response } from "express";
import { stripeService } from "../services/stripeService";
import { supabase } from "../lib/supabase"; // TEMPORARY STUB during migration
import { prisma } from "../lib/prisma";

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

    // Check if creator exists
    const { data: creator } = await supabase
      .from("creators")
      .select("*")
      .eq("id", creatorId)
      .single();

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    // Check if already has Stripe account
    if (creator.stripe_account_id) {
      // Get existing onboarding link if account exists but not complete
      const accountStatus = await stripeService.checkAccountStatus(
        creator.stripe_account_id,
      );

      if (!accountStatus.is_complete) {
        const onboardingLink = await stripeService.createConnectOnboardingLink(
          creator.stripe_account_id,
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
    res.status(500).json({ error: "Failed to start onboarding process" });
  }
});

// Check onboarding status
creators.get(
  "/onboard-status/:creatorId",
  async (req: Request, res: Response) => {
    try {
      const { creatorId } = req.params;

      // Get creator's Stripe account ID
      const { data: creator } = await supabase
        .from("creators")
        .select("stripe_account_id, payout_enabled, onboarding_complete")
        .eq("id", creatorId)
        .single();

      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }

      if (!creator.stripe_account_id) {
        return res.json({
          status: "not_started",
          message: "Onboarding not started",
          can_receive_payments: false,
        });
      }

      // Check Stripe account status
      const accountStatus = await stripeService.checkAccountStatus(
        creator.stripe_account_id,
      );

      // Update database if status changed
      if (accountStatus.is_complete !== creator.onboarding_complete) {
        await supabase
          .from("creators")
          .update({
            payout_enabled: accountStatus.payouts_enabled,
            onboarding_complete: accountStatus.is_complete,
          })
          .eq("id", creatorId);
      }

      res.json({
        status: accountStatus.is_complete ? "completed" : "pending",
        account_status: accountStatus,
        can_receive_payments: accountStatus.charges_enabled,
        can_receive_payouts: accountStatus.payouts_enabled,
      });
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      res.status(500).json({ error: "Failed to check onboarding status" });
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

    // Get creator info
    const { data: creator } = await supabase
      .from("creators")
      .select("*")
      .eq("id", creatorId)
      .single();

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    // Get earnings data
    const { data: earnings } = await supabase
      .from("creator_earnings")
      .select("*")
      .eq("creator_id", creatorId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    // Get subscriber count
    const { count: subscriberCount } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact" })
      .eq("creator_id", creatorId)
      .eq("is_active", true);

    // Get recent transactions
    const { data: recentTransactions } = await supabase
      .from("transactions")
      .select(
        `
        *,
        users (name, avatar_url)
      `,
      )
      .eq("to_user_id", creatorId)
      .order("created_at", { ascending: false })
      .limit(10);

    // Calculate totals
    const totalEarnings =
      earnings?.reduce((sum, e) => sum + e.net_amount, 0) || 0;
    const totalFees =
      earnings?.reduce((sum, e) => sum + e.platform_fee, 0) || 0;
    const pendingBalance =
      earnings
        ?.filter((e) => e.status === "pending")
        .reduce((sum, e) => sum + e.net_amount, 0) || 0;

    // Get Stripe balance if onboarding complete
    let stripeBalance = null;
    if (creator.stripe_account_id && creator.onboarding_complete) {
      try {
        stripeBalance = await stripeService.getBalance(
          creator.stripe_account_id,
        );
      } catch (error) {
        console.error("Error fetching Stripe balance:", error);
      }
    }

    res.json({
      creator: {
        id: creator.id,
        name: creator.name,
        username: creator.username,
        avatar_url: creator.avatar_url,
        subscription_price: creator.subscription_price,
        onboarding_complete: creator.onboarding_complete,
        payout_enabled: creator.payout_enabled,
      },
      stats: {
        total_earnings: totalEarnings / 100, // Convert cents to dollars
        total_fees: totalFees / 100,
        pending_balance: pendingBalance / 100,
        subscriber_count: subscriberCount || 0,
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
    res.status(500).json({ error: "Failed to fetch dashboard data" });
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

    // Get creator info
    const { data: creator } = await supabase
      .from("creators")
      .select("*")
      .eq("id", creatorId)
      .single();

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    if (!creator.stripe_account_id || !creator.payout_enabled) {
      return res
        .status(400)
        .json({ error: "Payout not available. Complete onboarding first." });
    }

    // Check available balance
    const stripeBalance = await stripeService.getBalance(
      creator.stripe_account_id,
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
      creator.stripe_account_id,
      amount,
    );

    // Record payout in database
    await supabase.from("transactions").insert({
      to_user_id: creatorId,
      stripe_payment_intent_id: payout.id,
      amount: amount / 100,
      currency: "usd",
      type: "payout",
      status: payout.status,
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
    res.status(500).json({ error: "Failed to initiate payout" });
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
    const { data, error } = await supabase
      .from("creators")
      .update({ subscription_price: price })
      .eq("id", creatorId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: "Subscription price updated successfully",
      creator: data,
      price: price / 100, // Return in dollars
    });
  } catch (error) {
    console.error("Error updating subscription price:", error);
    res.status(500).json({ error: "Failed to update subscription price" });
  }
});

// Get creator's earnings history
creators.get("/earnings/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { page = 1, limit = 50, type } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from("creator_earnings")
      .select("*", { count: "exact" })
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    const { data: earnings, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / Number(limit));

    res.json({
      earnings: earnings || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching earnings history:", error);
    res.status(500).json({ error: "Failed to fetch earnings history" });
  }
});

// Get payout history
creators.get("/payouts/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const {
      data: payouts,
      error,
      count,
    } = await supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .eq("to_user_id", creatorId)
      .eq("type", "payout")
      .order("created_at", { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / Number(limit));

    res.json({
      payouts: payouts || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching payout history:", error);
    res.status(500).json({ error: "Failed to fetch payout history" });
  }
});

export { creators };
