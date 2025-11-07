import Stripe from "stripe";
import { supabase } from "../lib/supabase"; // TEMPORARY STUB during migration

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export class StripeService {
  private static instance: StripeService;
  public stripe: Stripe;

  private constructor() {
    this.stripe = stripe;
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  // CREATOR ONBOARDING - Stripe Connect
  async createConnectAccount(creatorId: string, email: string, country = "CO") {
    try {
      const account = await this.stripe.accounts.create({
        type: "express",
        country,
        email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          creatorId: creatorId,
        },
      });

      // Store Connect account ID in database
      await supabase
        .from("creators")
        .update({
          stripe_account_id: account.id,
          payout_enabled: false,
        })
        .eq("id", creatorId);

      return account;
    } catch (error) {
      console.error("Error creating Connect account:", error);
      throw error;
    }
  }

  async createConnectOnboardingLink(accountId: string, creatorId: string) {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.CLIENT_URL}/creator/onboarding?creator=${creatorId}&refresh=true`,
        return_url: `${process.env.CLIENT_URL}/creator/dashboard?onboarding=complete`,
        type: "account_onboarding",
      });

      return accountLink.url;
    } catch (error) {
      console.error("Error creating onboarding link:", error);
      throw error;
    }
  }

  async checkAccountStatus(accountId: string) {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);

      const isComplete =
        account.charges_enabled &&
        account.payouts_enabled &&
        account.details_submitted;

      return {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        is_complete: isComplete,
        requirements: account.requirements,
      };
    } catch (error) {
      console.error("Error checking account status:", error);
      throw error;
    }
  }

  // SUBSCRIPTION MANAGEMENT
  async createCustomer(userId: string, email: string, name?: string) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          userId: userId,
        },
      });

      // Store customer ID in database
      await supabase
        .from("users")
        .update({ stripe_customer_id: customer.id })
        .eq("id", userId);

      return customer;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }

  async createSubscription(
    customerId: string,
    creatorId: string,
    priceId: string,
  ) {
    try {
      // Get creator's Connect account
      const { data: creator } = await supabase
        .from("creators")
        .select("stripe_account_id, subscription_price")
        .eq("id", creatorId)
        .single();

      if (!creator?.stripe_account_id) {
        throw new Error("Creator has not completed Stripe onboarding");
      }

      // Calculate platform fee (20% of subscription price)
      const subscriptionAmount = creator.subscription_price || 1499; // $14.99 default
      const platformFeePercent = 20; // 20% commission
      const applicationFeeAmount = Math.round(
        (subscriptionAmount * platformFeePercent) / 100,
      );

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        application_fee_percent: platformFeePercent,
        transfer_data: {
          destination: creator.stripe_account_id,
        },
        metadata: {
          creatorId: creatorId,
          type: "subscription",
        },
      });

      return subscription;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  async createPrice(creatorId: string, amount: number, currency = "usd") {
    try {
      const price = await this.stripe.prices.create({
        unit_amount: amount, // Amount in cents
        currency,
        recurring: {
          interval: "month",
        },
        product_data: {
          name: `Creator Subscription - ${creatorId}`,
          metadata: {
            creatorId: creatorId,
          },
        },
        metadata: {
          creatorId: creatorId,
        },
      });

      return price;
    } catch (error) {
      console.error("Error creating price:", error);
      throw error;
    }
  }

  // TIP/DONATION PROCESSING
  async processTip(
    customerId: string,
    creatorId: string,
    amount: number,
    paymentMethodId: string,
    message?: string,
  ) {
    try {
      // Get creator's Connect account
      const { data: creator } = await supabase
        .from("creators")
        .select("stripe_account_id")
        .eq("id", creatorId)
        .single();

      if (!creator?.stripe_account_id) {
        throw new Error("Creator has not completed Stripe onboarding");
      }

      // Calculate platform fee (20% of tip amount)
      const platformFeePercent = 20;
      const applicationFeeAmount = Math.round(
        (amount * platformFeePercent) / 100,
      );

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: "usd",
        customer: customerId,
        payment_method: paymentMethodId,
        confirm: true,
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: creator.stripe_account_id,
        },
        metadata: {
          creatorId: creatorId,
          type: "tip",
          message: message || "",
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error("Error processing tip:", error);
      throw error;
    }
  }

  // PAYOUT MANAGEMENT
  async createPayout(creatorStripeAccountId: string, amount: number) {
    try {
      const payout = await this.stripe.payouts.create(
        {
          amount: amount, // Amount in cents
          currency: "usd",
          metadata: {
            type: "creator_payout",
          },
        },
        {
          stripeAccount: creatorStripeAccountId, // This payout goes to the creator's account
        },
      );

      return payout;
    } catch (error) {
      console.error("Error creating payout:", error);
      throw error;
    }
  }

  async getBalance(creatorStripeAccountId: string) {
    try {
      const balance = await this.stripe.balance.retrieve({
        stripeAccount: creatorStripeAccountId,
      });

      return {
        available: balance.available,
        pending: balance.pending,
        total_available: balance.available.reduce(
          (sum, b) => sum + b.amount,
          0,
        ),
        total_pending: balance.pending.reduce((sum, b) => sum + b.amount, 0),
      };
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  // ANALYTICS & REPORTING
  async getCreatorEarnings(
    creatorStripeAccountId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    try {
      const charges = await this.stripe.charges.list(
        {
          created: {
            gte: startDate ? Math.floor(startDate.getTime() / 1000) : undefined,
            lte: endDate ? Math.floor(endDate.getTime() / 1000) : undefined,
          },
          limit: 100,
        },
        {
          stripeAccount: creatorStripeAccountId,
        },
      );

      const earnings = charges.data.reduce((total, charge) => {
        if (charge.status === "succeeded") {
          return total + charge.amount;
        }
        return total;
      }, 0);

      return {
        total_earnings: earnings,
        transaction_count: charges.data.filter((c) => c.status === "succeeded")
          .length,
        charges: charges.data,
      };
    } catch (error) {
      console.error("Error getting creator earnings:", error);
      throw error;
    }
  }

  async getPlatformRevenue(startDate?: Date, endDate?: Date) {
    try {
      const applicationFees = await this.stripe.applicationFees.list({
        created: {
          gte: startDate ? Math.floor(startDate.getTime() / 1000) : undefined,
          lte: endDate ? Math.floor(endDate.getTime() / 1000) : undefined,
        },
        limit: 100,
      });

      const totalRevenue = applicationFees.data.reduce((total, fee) => {
        return total + fee.amount;
      }, 0);

      return {
        total_revenue: totalRevenue,
        fee_count: applicationFees.data.length,
        fees: applicationFees.data,
      };
    } catch (error) {
      console.error("Error getting platform revenue:", error);
      throw error;
    }
  }

  // WEBHOOK PROCESSING
  async processWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case "account.updated":
          await this.handleAccountUpdated(event.data.object as Stripe.Account);
          break;

        case "payment_intent.succeeded":
          await this.handlePaymentSucceeded(
            event.data.object as Stripe.PaymentIntent,
          );
          break;

        case "invoice.payment_succeeded":
          await this.handleSubscriptionPayment(
            event.data.object as Stripe.Invoice,
          );
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await this.handleSubscriptionChange(
            event.data.object as Stripe.Subscription,
          );
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Error processing webhook event:", error);
      throw error;
    }
  }

  private async handleAccountUpdated(account: Stripe.Account) {
    const creatorId = account.metadata?.creatorId;
    if (!creatorId) return;

    const isComplete =
      account.charges_enabled &&
      account.payouts_enabled &&
      account.details_submitted;

    await supabase
      .from("creators")
      .update({
        payout_enabled: isComplete,
        onboarding_complete: isComplete,
      })
      .eq("id", creatorId);
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const creatorId = paymentIntent.metadata?.creatorId;
    const type = paymentIntent.metadata?.type;

    if (!creatorId || !type) return;

    // Record transaction in database
    await supabase.from("transactions").insert({
      creator_id: creatorId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      type: type,
      status: "completed",
      metadata: paymentIntent.metadata,
    });

    // Update creator earnings
    const netAmount = Math.round(paymentIntent.amount * 0.8); // Creator gets 80%

    await supabase.from("creator_earnings").insert({
      creator_id: creatorId,
      transaction_id: paymentIntent.id,
      gross_amount: paymentIntent.amount,
      net_amount: netAmount,
      platform_fee: paymentIntent.amount - netAmount,
      type: type,
      status: "pending",
    });
  }

  private async handleSubscriptionPayment(invoice: Stripe.Invoice) {
    // Handle recurring subscription payments
    if ((invoice as any).subscription && invoice.status === "paid") {
      const subscription = await this.stripe.subscriptions.retrieve(
        (invoice as any).subscription as string,
      );
      const creatorId = subscription.metadata?.creatorId;

      if (creatorId && (invoice as any).payment_intent) {
        await this.handlePaymentSucceeded({
          id: (invoice as any).payment_intent as string,
          amount: invoice.amount_paid || 0,
          currency: invoice.currency || "usd",
          metadata: {
            creatorId: creatorId,
            type: "subscription",
          },
        } as any);
      }
    }
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription) {
    const creatorId = subscription.metadata?.creatorId;
    if (!creatorId) return;

    // Update subscription status in database
    await supabase.from("subscriptions").upsert({
      stripe_subscription_id: subscription.id,
      creator_id: creatorId,
      customer_id: subscription.customer as string,
      status: subscription.status,
      current_period_start: (subscription as any).current_period_start
        ? new Date((subscription as any).current_period_start * 1000)
        : new Date(),
      current_period_end: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : new Date(),
    });
  }
}

export const stripeService = StripeService.getInstance();
