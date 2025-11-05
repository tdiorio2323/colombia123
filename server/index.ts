import "dotenv/config";
import express from "express";
import cors from "cors";
import { corsOptions } from "./middleware/security";
import { handleDemo } from "./routes/demo";
import { handleSmartReply } from "./routes/smart-reply";
import { auth } from "./routes/auth";
import { creators } from "./routes/creators";
import { profiles } from "./routes/profiles";
import { messages } from "./routes/messages";
import { users } from "./routes/users";
import { subscriptions } from "./routes/subscriptions";
import { payouts } from "./routes/payouts";
import { upload } from "./routes/upload";
import { media } from "./routes/media";
import { webhooks } from "./routes/webhooks";
import dbRoutes from "./routes/db";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/smart-reply", handleSmartReply);

  // Auth routes
  app.use("/api/auth", auth);

  // Core business routes
  app.use("/api/creators", creators);
  app.use("/api/profiles", profiles);
  app.use("/api/users", users);
  app.use("/api/subscriptions", subscriptions);
  app.use("/api/payouts", payouts);

  // Media & uploads
  app.use("/api/upload", upload);
  app.use("/api/media", media);

  // Messaging
  app.use("/api/messages", messages);

  // Webhooks (must handle raw body for Stripe)
  app.use("/api/webhooks", webhooks);

  // Database health
  app.use("/api/db", dbRoutes);

  return app;
}
