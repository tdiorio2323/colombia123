import express, { Router } from "express";
import { Request, Response } from "express";
import { stripeService, stripe } from "../services/stripeService";
// import { supabase } from "../lib/supabase"; // DISABLED - migrated to Prisma

const webhooks = Router();

// Stripe webhook endpoint with proper signature verification
webhooks.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    try {
      // Verify webhook signature using Stripe SDK
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      console.log(`Processing webhook event: ${event.type}`);

      // Use the StripeService to process the event
      await stripeService.processWebhookEvent(event);

      res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
);

// Legacy webhook endpoint for other payment processors (if needed)
webhooks.post("/legacy", async (req: Request, res: Response) => {
  // Handle other payment processors if needed
  res.json({ message: "Legacy webhook endpoint" });
});

export { webhooks };
