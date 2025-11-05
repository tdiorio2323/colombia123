import { Router } from "express";
import { supabase } from "../lib/supabase"; // TEMPORARY STUB during migration
import { Request, Response } from "express";
import { stripeService } from "../services/stripeService";
import { loggers } from "@server/lib/logger";
import {
  validateSubscriptionRequest,
  validateTipRequest,
  validateSetupIntentRequest,
} from "../middleware/validation";

const subscriptions = Router();

// Create subscription for a creator
subscriptions.post(
  "/subscribe",
  validateSubscriptionRequest,
  async (req: Request, res: Response) => {
    try {
      const { creatorId, userId, paymentMethodId } = req.body;

      if (!creatorId || !userId) {
        return res
          .status(400)
          .json({ error: "Creator ID and User ID are required" });
      }

      // Get user's Stripe customer ID or create one
      const { data: user } = await supabase
        .from("users")
        .select("stripe_customer_id, email, name")
        .eq("id", userId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripe_customer_id;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripeService.createCustomer(
          userId,
          user.email,
          user.name,
        );
        customerId = customer.id;
      }

      // Attach payment method to customer
      if (paymentMethodId) {
        await stripeService.stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });

        // Set as default payment method
        await stripeService.stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      // Get creator's subscription price
      const { data: creator } = await supabase
        .from("creators")
        .select("subscription_price, stripe_account_id")
        .eq("id", creatorId)
        .single();

      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }

      if (!creator.stripe_account_id) {
        return res
          .status(400)
          .json({ error: "Creator has not completed onboarding" });
      }

      // Create price for this creator's subscription
      const subscriptionAmount = creator.subscription_price || 1499; // $14.99 default
      const price = await stripeService.createPrice(
        creatorId,
        subscriptionAmount,
      );

      // Create the subscription
      const subscription = await stripeService.createSubscription(
        customerId,
        creatorId,
        price.id,
      );

      // Record subscription in database
      await supabase.from("subscriptions").insert({
        stripe_subscription_id: subscription.id,
        creator_id: creatorId,
        fan_id: userId,
        amount: subscriptionAmount / 100,
        status: subscription.status,
        current_period_start: (subscription as any).current_period_start
          ? new Date((subscription as any).current_period_start * 1000)
          : new Date(),
        current_period_end: (subscription as any).current_period_end
          ? new Date((subscription as any).current_period_end * 1000)
          : new Date(),
        is_active: subscription.status === "active",
      });

      res.json({
        message: "Subscription created successfully",
        subscription: {
          id: subscription.id,
          status: subscription.status,
          amount: subscriptionAmount / 100,
          current_period_end: (subscription as any).current_period_end
            ? new Date((subscription as any).current_period_end * 1000)
            : null,
        },
      });
    } catch (error) {
      loggers.payment.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  },
);

// Cancel subscription
subscriptions.post("/cancel", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, userId } = req.body;

    if (!subscriptionId || !userId) {
      return res
        .status(400)
        .json({ error: "Subscription ID and User ID are required" });
    }

    // Verify user owns this subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("stripe_subscription_id", subscriptionId)
      .eq("fan_id", userId)
      .single();

    if (!subscription) {
      return res
        .status(404)
        .json({ error: "Subscription not found or access denied" });
    }

    // Cancel at period end to allow access until current billing period ends
    const cancelledSubscription =
      await stripeService.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

    // Update database
    await supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: true,
        cancelled_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    res.json({
      message:
        "Subscription will be cancelled at the end of current billing period",
      subscription: {
        id: cancelledSubscription.id,
        status: cancelledSubscription.status,
        cancel_at_period_end: cancelledSubscription.cancel_at_period_end,
        current_period_end: (cancelledSubscription as any).current_period_end
          ? new Date((cancelledSubscription as any).current_period_end * 1000)
          : null,
      },
    });
  } catch (error) {
    loggers.payment.error("Error cancelling subscription:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// Reactivate cancelled subscription
subscriptions.post("/reactivate", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, userId } = req.body;

    if (!subscriptionId || !userId) {
      return res
        .status(400)
        .json({ error: "Subscription ID and User ID are required" });
    }

    // Verify user owns this subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("stripe_subscription_id", subscriptionId)
      .eq("fan_id", userId)
      .single();

    if (!subscription) {
      return res
        .status(404)
        .json({ error: "Subscription not found or access denied" });
    }

    // Reactivate subscription
    const reactivatedSubscription =
      await stripeService.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

    // Update database
    await supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: false,
        cancelled_at: null,
        is_active: true,
      })
      .eq("stripe_subscription_id", subscriptionId);

    res.json({
      message: "Subscription reactivated successfully",
      subscription: {
        id: reactivatedSubscription.id,
        status: reactivatedSubscription.status,
        cancel_at_period_end: false,
      },
    });
  } catch (error) {
    loggers.payment.error("Error reactivating subscription:", error);
    res.status(500).json({ error: "Failed to reactivate subscription" });
  }
});

// Get user's subscriptions
subscriptions.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        creators (
          id,
          name,
          username,
          avatar_url,
          subscription_price
        )
      `,
      )
      .eq("fan_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ subscriptions });
  } catch (error) {
    loggers.payment.error("Error fetching user subscriptions:", error);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});

// Get creator's subscribers
subscriptions.get(
  "/creator/:creatorId",
  async (req: Request, res: Response) => {
    try {
      const { creatorId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const {
        data: subscriptions,
        error,
        count,
      } = await supabase
        .from("subscriptions")
        .select(
          `
        *,
        users (
          id,
          name,
          email,
          avatar_url
        )
      `,
          { count: "exact" },
        )
        .eq("creator_id", creatorId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) {
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / Number(limit));

      res.json({
        subscriptions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
          totalPages,
        },
      });
    } catch (error) {
      loggers.payment.error("Error fetching creator subscribers:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  },
);

// Update subscription price (for creator)
subscriptions.put("/price", async (req: Request, res: Response) => {
  try {
    const { creatorId, newPrice } = req.body;

    if (!creatorId || !newPrice || newPrice < 499) {
      return res
        .status(400)
        .json({ error: "Creator ID and price (minimum $4.99) are required" });
    }

    // Update creator's subscription price
    await supabase
      .from("creators")
      .update({ subscription_price: newPrice })
      .eq("id", creatorId);

    // Note: Existing subscriptions will continue at their current price
    // New subscriptions will use the new price

    res.json({
      message: "Subscription price updated successfully",
      newPrice: newPrice / 100,
    });
  } catch (error) {
    loggers.payment.error("Error updating subscription price:", error);
    res.status(500).json({ error: "Failed to update subscription price" });
  }
});

// Process tip/donation
subscriptions.post(
  "/tip",
  validateTipRequest,
  async (req: Request, res: Response) => {
    try {
      const { creatorId, userId, amount, paymentMethodId, message } = req.body;

      if (!creatorId || !userId || !amount || amount < 100) {
        return res.status(400).json({
          error: "Creator ID, User ID, and amount (minimum $1.00) are required",
        });
      }

      // Get user's Stripe customer ID
      const { data: user } = await supabase
        .from("users")
        .select("stripe_customer_id, email, name")
        .eq("id", userId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripe_customer_id;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripeService.createCustomer(
          userId,
          user.email,
          user.name,
        );
        customerId = customer.id;
      }

      // Process the tip
      const paymentIntent = await stripeService.processTip(
        customerId,
        creatorId,
        amount,
        paymentMethodId,
        message,
      );

      // Record tip in database
      await supabase.from("transactions").insert({
        from_user_id: userId,
        to_user_id: creatorId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount / 100,
        currency: "usd",
        type: "tip",
        status: paymentIntent.status === "succeeded" ? "completed" : "pending",
        metadata: { message },
      });

      res.json({
        message: "Tip processed successfully",
        tip: {
          id: paymentIntent.id,
          amount: amount / 100,
          status: paymentIntent.status,
          message,
        },
      });
    } catch (error) {
      loggers.payment.error("Error processing tip:", error);
      res.status(500).json({ error: "Failed to process tip" });
    }
  },
);

// Get subscription analytics for creator
subscriptions.get(
  "/analytics/:creatorId",
  async (req: Request, res: Response) => {
    try {
      const { creatorId } = req.params;
      const { startDate, endDate } = req.query;

      // Get subscription stats
      const { data: activeSubscriptions, count: activeCount } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact" })
        .eq("creator_id", creatorId)
        .eq("is_active", true);

      // Get total subscribers (including cancelled)
      const { count: totalCount } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact" })
        .eq("creator_id", creatorId);

      // Get recent transactions
      let transactionQuery = supabase
        .from("transactions")
        .select("*")
        .eq("to_user_id", creatorId)
        .in("type", ["subscription", "subscription_renewal", "tip"]);

      if (startDate) {
        transactionQuery = transactionQuery.gte("created_at", startDate);
      }
      if (endDate) {
        transactionQuery = transactionQuery.lte("created_at", endDate);
      }

      const { data: transactions } = await transactionQuery.order(
        "created_at",
        { ascending: false },
      );

      // Calculate earnings
      const totalEarnings =
        transactions?.reduce((sum, t) => sum + (t.creator_earnings || 0), 0) ||
        0;
      const subscriptionEarnings =
        transactions
          ?.filter((t) => t.type.includes("subscription"))
          .reduce((sum, t) => sum + (t.creator_earnings || 0), 0) || 0;
      const tipEarnings =
        transactions
          ?.filter((t) => t.type === "tip")
          .reduce((sum, t) => sum + (t.creator_earnings || 0), 0) || 0;

      res.json({
        stats: {
          active_subscribers: activeCount || 0,
          total_subscribers: totalCount || 0,
          total_earnings: totalEarnings,
          subscription_earnings: subscriptionEarnings,
          tip_earnings: tipEarnings,
          recent_transactions: transactions?.slice(0, 10) || [],
        },
      });
    } catch (error) {
      loggers.payment.error("Error fetching subscription analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  },
);

// Create setup intent for payment method collection
subscriptions.post(
  "/setup-intent",
  validateSetupIntentRequest,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Get or create Stripe customer
      const { data: user } = await supabase
        .from("users")
        .select("stripe_customer_id, email, name")
        .eq("id", userId)
        .single();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripe_customer_id;

      if (!customerId) {
        const customer = await stripeService.createCustomer(
          userId,
          user.email,
          user.name,
        );
        customerId = customer.id;
      }

      // Create setup intent for future payments
      const setupIntent = await stripeService.stripe.setupIntents.create({
        customer: customerId,
        usage: "off_session",
        payment_method_types: ["card"],
      });

      res.json({
        client_secret: setupIntent.client_secret,
        customer_id: customerId,
      });
    } catch (error) {
      loggers.payment.error("Error creating setup intent:", error);
      res.status(500).json({ error: "Failed to create setup intent" });
    }
  },
);

export { subscriptions };
