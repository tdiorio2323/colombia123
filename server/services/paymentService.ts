import { supabase } from "../lib/supabase"; // TEMPORARY STUB during migration

interface PaymentProcessor {
  processSubscription(
    fanId: string,
    creatorId: string,
    amount: number,
  ): Promise<PaymentResult>;
  processTip(
    fanId: string,
    creatorId: string,
    amount: number,
    message?: string,
  ): Promise<PaymentResult>;
  processCreatorPayout(creatorId: string): Promise<PayoutResult>;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  platformFee: number;
  processingFee: number;
  creatorEarnings: number;
  error?: string;
}

interface PayoutResult {
  success: boolean;
  payoutId: string;
  amount: number;
  error?: string;
}

export class PaymentService implements PaymentProcessor {
  private readonly PLATFORM_COMMISSION_RATE = 0.2; // 20% platform cut
  private readonly STRIPE_PROCESSING_RATE = 0.029; // 2.9%
  private readonly STRIPE_FIXED_FEE = 0.3; // $0.30

  constructor(
    private stripeSecretKey: string,
    private supabaseClient: typeof supabase,
  ) {}

  /**
   * Process a subscription payment
   * Fan → Platform → Creator (after commission)
   */
  async processSubscription(
    fanId: string,
    creatorId: string,
    amount: number,
  ): Promise<PaymentResult> {
    try {
      // Calculate fees
      const fees = this.calculateFees(amount);

      // 1. Charge the fan via Stripe
      const paymentIntent = await this.chargeCustomer(fanId, amount);

      if (!paymentIntent.success) {
        throw new Error("Payment failed");
      }

      // 2. Record transaction in database
      const transaction = await this.recordTransaction({
        from_user_id: fanId,
        to_user_id: creatorId,
        amount: amount,
        type: "subscription",
        status: "completed",
        platform_fee: fees.platformFee,
        processing_fee: fees.processingFee,
        creator_earnings: fees.creatorEarnings,
        payment_processor_id: paymentIntent.id,
      });

      // 3. Update creator earnings
      await this.updateCreatorBalance(creatorId, fees.creatorEarnings);

      // 4. Create/update subscription
      await this.createSubscription(fanId, creatorId, amount);

      return {
        success: true,
        transactionId: transaction.id,
        platformFee: fees.platformFee,
        processingFee: fees.processingFee,
        creatorEarnings: fees.creatorEarnings,
      };
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        platformFee: 0,
        processingFee: 0,
        creatorEarnings: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Process a tip/donation payment
   */
  async processTip(
    fanId: string,
    creatorId: string,
    amount: number,
    message?: string,
  ): Promise<PaymentResult> {
    try {
      const fees = this.calculateFees(amount);

      const paymentIntent = await this.chargeCustomer(fanId, amount);

      if (!paymentIntent.success) {
        throw new Error("Tip payment failed");
      }

      const transaction = await this.recordTransaction({
        from_user_id: fanId,
        to_user_id: creatorId,
        amount: amount,
        type: "tip",
        status: "completed",
        platform_fee: fees.platformFee,
        processing_fee: fees.processingFee,
        creator_earnings: fees.creatorEarnings,
        payment_processor_id: paymentIntent.id,
        message: message,
      });

      await this.updateCreatorBalance(creatorId, fees.creatorEarnings);

      return {
        success: true,
        transactionId: transaction.id,
        platformFee: fees.platformFee,
        processingFee: fees.processingFee,
        creatorEarnings: fees.creatorEarnings,
      };
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        platformFee: 0,
        processingFee: 0,
        creatorEarnings: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Process creator payout (weekly/monthly)
   * Platform → Creator's Bank Account
   */
  async processCreatorPayout(creatorId: string): Promise<PayoutResult> {
    try {
      // 1. Get creator's pending balance
      const { data: creator } = await this.supabaseClient
        .from("profiles")
        .select("pending_balance, stripe_account_id")
        .eq("user_id", creatorId)
        .single();

      if (!creator || creator.pending_balance <= 0) {
        throw new Error("No pending balance for payout");
      }

      // 2. Create Stripe payout to creator's connected account
      const payout = await this.createStripePayout(
        creator.stripe_account_id,
        creator.pending_balance,
      );

      if (!payout.success) {
        throw new Error("Payout failed");
      }

      // 3. Record payout transaction
      await this.recordTransaction({
        from_user_id: "platform", // Platform system account
        to_user_id: creatorId,
        amount: creator.pending_balance,
        type: "payout",
        status: "completed",
        payment_processor_id: payout.id,
      });

      // 4. Clear creator's pending balance
      await this.supabaseClient
        .from("profiles")
        .update({
          pending_balance: 0,
          total_payouts:
            ((creator as any).total_payouts || 0) + creator.pending_balance,
        })
        .eq("user_id", creatorId);

      return {
        success: true,
        payoutId: payout.id,
        amount: creator.pending_balance,
      };
    } catch (error) {
      return {
        success: false,
        payoutId: "",
        amount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Calculate platform commission and processing fees
   */
  private calculateFees(grossAmount: number) {
    const processingFee =
      grossAmount * this.STRIPE_PROCESSING_RATE + this.STRIPE_FIXED_FEE;
    const netAmount = grossAmount - processingFee;
    const platformFee = netAmount * this.PLATFORM_COMMISSION_RATE;
    const creatorEarnings = netAmount - platformFee;

    return {
      processingFee: Math.round(processingFee * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      creatorEarnings: Math.round(creatorEarnings * 100) / 100,
    };
  }

  /**
   * Charge customer via Stripe
   */
  private async chargeCustomer(fanId: string, amount: number) {
    // Stripe integration here
    // Return mock for now
    return {
      success: true,
      id: `pi_${Date.now()}`,
      amount: amount,
    };
  }

  /**
   * Create Stripe payout to creator
   */
  private async createStripePayout(stripeAccountId: string, amount: number) {
    // Stripe Express/Connect payout here
    return {
      success: true,
      id: `po_${Date.now()}`,
      amount: amount,
    };
  }

  /**
   * Record transaction in database
   */
  private async recordTransaction(transaction: any) {
    const { data, error } = await this.supabaseClient
      .from("transactions")
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update creator's pending balance
   */
  private async updateCreatorBalance(creatorId: string, earnings: number) {
    const { error } = await this.supabaseClient.rpc(
      "increment_creator_balance",
      {
        creator_id: creatorId,
        amount: earnings,
      },
    );

    if (error) throw error;
  }

  /**
   * Create subscription record
   */
  private async createSubscription(
    fanId: string,
    creatorId: string,
    amount: number,
  ) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error } = await this.supabaseClient.from("subscriptions").upsert({
      fan_id: fanId,
      creator_id: creatorId,
      amount: amount,
      is_active: true,
      started_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    if (error) throw error;
  }
}

// Export singleton instance
export const paymentService = new PaymentService(
  process.env.STRIPE_SECRET_KEY!,
  supabase,
);
