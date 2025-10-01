import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { logError } from "../lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export interface WebhookRequest extends Request {
  rawBody: Buffer;
}

export const rawBodyParser = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.originalUrl === "/api/webhooks/stripe") {
    let data = "";
    req.setEncoding("utf8");

    req.on("data", (chunk: string) => {
      data += chunk;
    });

    req.on("end", () => {
      (req as WebhookRequest).rawBody = Buffer.from(data, "utf8");
      next();
    });
  } else {
    next();
  }
};

export const verifyStripeSignature = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const signature = req.get("stripe-signature");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      res.status(400).json({
        error: "Missing Stripe signature",
        code: "MISSING_SIGNATURE",
      });
      return;
    }

    if (!endpointSecret) {
      logError(new Error("Stripe webhook secret not configured"), {
        endpoint: req.path,
        ip: req.ip,
      });
      res.status(500).json({
        error: "Webhook not configured",
        code: "WEBHOOK_NOT_CONFIGURED",
      });
      return;
    }

    const webhookReq = req as WebhookRequest;

    if (!webhookReq.rawBody) {
      res.status(400).json({
        error: "Missing request body",
        code: "MISSING_BODY",
      });
      return;
    }

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      webhookReq.rawBody,
      signature,
      endpointSecret,
    );

    // Attach the verified event to the request
    (req as any).stripeEvent = event;

    next();
  } catch (error: any) {
    logError(error, {
      endpoint: req.path,
      ip: req.ip,
      signature: req.get("stripe-signature"),
    });

    if (error.type === "StripeSignatureVerificationError") {
      res.status(400).json({
        error: "Invalid signature",
        code: "INVALID_SIGNATURE",
      });
      return;
    }

    res.status(400).json({
      error: "Webhook verification failed",
      code: "WEBHOOK_VERIFICATION_FAILED",
    });
  }
};

export const preventReplayAttacks = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const event = (req as any).stripeEvent;

  if (!event) {
    res.status(400).json({
      error: "No verified event found",
      code: "NO_EVENT",
    });
    return;
  }

  const eventAge = Date.now() - new Date(event.created * 1000).getTime();
  const maxAge = 5 * 60 * 1000; // 5 minutes

  if (eventAge > maxAge) {
    logError(new Error("Webhook event too old"), {
      eventId: event.id,
      eventAge: eventAge / 1000,
      maxAge: maxAge / 1000,
    });

    res.status(400).json({
      error: "Event too old",
      code: "EVENT_TOO_OLD",
    });
    return;
  }

  // TODO: Implement idempotency check using Redis or database
  // to prevent processing the same event multiple times

  next();
};
