import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

// Health check endpoint
r.get("/health", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();
    const profileCount = await prisma.profile.count();
    const mediaCount = await prisma.media.count();
    const subscriptionCount = await prisma.subscription.count();
    const transactionCount = await prisma.transaction.count();

    res.json({
      ok: true,
      stats: {
        users: userCount,
        profiles: profileCount,
        media: mediaCount,
        subscriptions: subscriptionCount,
        transactions: transactionCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      ok: false,
      error: "Database connection failed",
      timestamp: new Date().toISOString(),
    });
  }
});

// Database stats endpoint for analytics
r.get("/stats", async (_req, res) => {
  try {
    const stats = await prisma.$queryRaw`
      SELECT
        'users' as table_name, COUNT(*) as count FROM users
      UNION ALL
      SELECT
        'creators' as table_name, COUNT(*) as count FROM profiles WHERE role = 'CREATOR'
      UNION ALL
      SELECT
        'fans' as table_name, COUNT(*) as count FROM profiles WHERE role = 'FAN'
      UNION ALL
      SELECT
        'active_subscriptions' as table_name, COUNT(*) as count FROM subscriptions WHERE "isActive" = true
      UNION ALL
      SELECT
        'total_transactions' as table_name, COUNT(*) as count FROM transactions
      UNION ALL
      SELECT
        'completed_transactions' as table_name, COUNT(*) as count FROM transactions WHERE status = 'COMPLETED'
    `;

    res.json({
      ok: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database stats query failed:", error);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch database statistics",
      timestamp: new Date().toISOString(),
    });
  }
});

export default r;
