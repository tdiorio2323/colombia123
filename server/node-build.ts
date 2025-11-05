import path from "path";
import { createServer } from "./index";
import * as express from "express";
import logger from "@server/lib/logger";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  logger.info(`🚀 Fusion Starter server running on port ${port}`);
  logger.info(`📱 Frontend: http://localhost:${port}`);
  logger.info(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
