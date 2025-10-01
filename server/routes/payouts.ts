import { Router } from "express";
import { supabase } from "../lib/supabase"; // TEMPORARY STUB during migration
import { Request, Response } from "express";
import { paymentService } from "../services/paymentService";

const payouts = Router();

// Get creator earnings summary
payouts.get("/earnings/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    // Get creator earnings data
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        pending_balance,
        total_earnings,
        total_payouts,
        last_payout_date,
        stripe_account_id
      `,
      )
      .eq("user_id", creatorId)
      .eq("role", "creator")
      .single();

    if (error) throw error;

    // Get recent transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("to_user_id", creatorId)
      .in("type", ["subscription", "tip", "subscription_renewal"])
      .order("created_at", { ascending: false })
      .limit(10);

    // Get payout history
    const { data: payoutHistory } = await supabase
      .from("transactions")
      .select("*")
      .eq("to_user_id", creatorId)
      .eq("type", "payout")
      .order("created_at", { ascending: false })
      .limit(5);

    res.json({
      earnings: {
        pending_balance: data.pending_balance || 0,
        total_earnings: data.total_earnings || 0,
        total_payouts: data.total_payouts || 0,
        last_payout_date: data.last_payout_date,
        has_stripe_account: !!data.stripe_account_id,
      },
      recent_transactions: transactions || [],
      payout_history: payoutHistory || [],
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ error: "Failed to fetch earnings data" });
  }
});

// Request payout (manual payout request)
payouts.post("/request/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    // Check if creator has pending balance
    const { data: creator } = await supabase
      .from("profiles")
      .select("pending_balance, stripe_account_id")
      .eq("user_id", creatorId)
      .single();

    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }

    if (!creator.stripe_account_id) {
      return res.status(400).json({
        error: "Please connect your Stripe account first",
        action_required: "connect_stripe",
      });
    }

    if (creator.pending_balance < 10) {
      // Minimum payout threshold
      return res.status(400).json({
        error: "Minimum payout amount is $10",
        current_balance: creator.pending_balance,
      });
    }

    // Process payout
    const result = await paymentService.processCreatorPayout(creatorId);

    if (result.success) {
      res.json({
        success: true,
        message: "Payout initiated successfully",
        payout_id: result.payoutId,
        amount: result.amount,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error processing payout request:", error);
    res.status(500).json({ error: "Failed to process payout request" });
  }
});

// Get platform revenue analytics (admin only)
payouts.get("/platform/analytics", async (req: Request, res: Response) => {
  try {
    // Total platform revenue
    const { data: totalRevenue } = await supabase
      .from("transactions")
      .select("platform_fee")
      .not("platform_fee", "is", null);

    const platformRevenue =
      totalRevenue?.reduce((sum, t) => sum + (t.platform_fee || 0), 0) || 0;

    // Monthly revenue breakdown
    const { data: monthlyRevenue } = await supabase
      .from("transactions")
      .select(
        `
        platform_fee,
        created_at,
        type
      `,
      )
      .gte(
        "created_at",
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      ) // Last 90 days
      .not("platform_fee", "is", null);

    // Group by month
    const monthlyBreakdown =
      monthlyRevenue?.reduce(
        (acc, transaction) => {
          const month = new Date(transaction.created_at)
            .toISOString()
            .slice(0, 7); // YYYY-MM
          if (!acc[month]) {
            acc[month] = { subscriptions: 0, tips: 0, total: 0 };
          }

          if (
            transaction.type === "subscription" ||
            transaction.type === "subscription_renewal"
          ) {
            acc[month].subscriptions += transaction.platform_fee;
          } else if (transaction.type === "tip") {
            acc[month].tips += transaction.platform_fee;
          }
          acc[month].total += transaction.platform_fee;

          return acc;
        },
        {} as Record<string, any>,
      ) || {};

    // Active creators count
    const { count: activeCreators } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "creator")
      .gt("total_earnings", 0);

    res.json({
      platform_revenue: {
        total: Math.round(platformRevenue * 100) / 100,
        monthly_breakdown: monthlyBreakdown,
        active_creators: activeCreators || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching platform analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Stripe Connect account setup for creators
payouts.post(
  "/connect-stripe/:creatorId",
  async (req: Request, res: Response) => {
    try {
      const { creatorId } = req.params;

      // Create Stripe Connect Express account
      // This would integrate with Stripe Connect API
      const connectUrl = `https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.STRIPE_CLIENT_ID}&state=${creatorId}&suggested_capabilities[]=transfers`;

      res.json({
        connect_url: connectUrl,
        message: "Complete Stripe account setup to receive payouts",
      });
    } catch (error) {
      console.error("Error setting up Stripe Connect:", error);
      res.status(500).json({ error: "Failed to setup payment account" });
    }
  },
);

export { payouts };
