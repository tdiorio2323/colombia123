import { prisma, handlePrismaError } from "../lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

export class SubscriptionService {
  // Create new subscription
  static async create(data: {
    creatorId: string;
    subscriberId: string;
    amount: number;
    stripeSubscriptionId?: string;
  }) {
    try {
      // Check if subscription already exists
      const existing = await prisma.subscription.findUnique({
        where: {
          creatorId_subscriberId: {
            creatorId: data.creatorId,
            subscriberId: data.subscriberId,
          },
        },
      });

      if (existing && existing.isActive) {
        return {
          data: null,
          error: "User is already subscribed to this creator",
        };
      }

      // Create or reactivate subscription
      const subscription = await prisma.subscription.upsert({
        where: {
          creatorId_subscriberId: {
            creatorId: data.creatorId,
            subscriberId: data.subscriberId,
          },
        },
        update: {
          isActive: true,
          status: "ACTIVE",
          amount: data.amount,
          stripeSubscriptionId: data.stripeSubscriptionId,
          startedAt: new Date(),
          canceledAt: null,
        },
        create: {
          creatorId: data.creatorId,
          subscriberId: data.subscriberId,
          amount: data.amount,
          isActive: true,
          status: "ACTIVE",
          stripeSubscriptionId: data.stripeSubscriptionId,
        },
        include: {
          creator: true,
          subscriber: { include: { profile: true } },
        },
      });

      // Update creator subscriber count
      await prisma.profile.update({
        where: { id: data.creatorId },
        data: {
          subscriberCount: { increment: existing ? 0 : 1 },
        },
      });

      // Update fan subscription count
      await prisma.profile.update({
        where: { userId: data.subscriberId },
        data: {
          subscriptionCount: { increment: existing ? 0 : 1 },
        },
      });

      return { data: subscription, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Cancel subscription
  static async cancel(creatorId: string, subscriberId: string) {
    try {
      const subscription = await prisma.subscription.update({
        where: {
          creatorId_subscriberId: {
            creatorId,
            subscriberId,
          },
        },
        data: {
          isActive: false,
          status: "CANCELED",
          canceledAt: new Date(),
        },
        include: {
          creator: true,
          subscriber: { include: { profile: true } },
        },
      });

      // Update counts
      await prisma.profile.update({
        where: { id: creatorId },
        data: {
          subscriberCount: { decrement: 1 },
        },
      });

      await prisma.profile.update({
        where: { userId: subscriberId },
        data: {
          subscriptionCount: { decrement: 1 },
        },
      });

      return { data: subscription, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get user subscriptions
  static async getUserSubscriptions(userId: string, includeInactive = false) {
    try {
      const whereClause = includeInactive ? {} : { isActive: true };

      const subscriptions = await prisma.subscription.findMany({
        where: {
          subscriberId: userId,
          ...whereClause,
        },
        include: {
          creator: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return { data: subscriptions, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get creator subscribers
  static async getCreatorSubscribers(
    creatorId: string,
    includeInactive = false,
  ) {
    try {
      const whereClause = includeInactive ? {} : { isActive: true };

      const subscriptions = await prisma.subscription.findMany({
        where: {
          creatorId,
          ...whereClause,
        },
        include: {
          subscriber: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return { data: subscriptions, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Check subscription status
  static async checkSubscription(creatorId: string, subscriberId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: {
          creatorId_subscriberId: {
            creatorId,
            subscriberId,
          },
        },
        include: {
          creator: true,
          subscriber: { include: { profile: true } },
        },
      });

      return { data: subscription, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Update subscription status (for Stripe webhooks)
  static async updateStatus(
    stripeSubscriptionId: string,
    status: SubscriptionStatus,
    isActive?: boolean,
  ) {
    try {
      const subscription = await prisma.subscription.update({
        where: { stripeSubscriptionId },
        data: {
          status,
          isActive: isActive ?? status === "ACTIVE",
          ...(status === "CANCELED" && { canceledAt: new Date() }),
        },
        include: {
          creator: true,
          subscriber: { include: { profile: true } },
        },
      });

      return { data: subscription, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get subscription analytics for creator
  static async getAnalytics(
    creatorId: string,
    period: "week" | "month" | "year" = "month",
  ) {
    try {
      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // New subscriptions in period
      const newSubscriptions = await prisma.subscription.count({
        where: {
          creatorId,
          createdAt: { gte: startDate },
        },
      });

      // Canceled subscriptions in period
      const canceledSubscriptions = await prisma.subscription.count({
        where: {
          creatorId,
          canceledAt: { gte: startDate },
        },
      });

      // Current active subscriptions
      const activeSubscriptions = await prisma.subscription.count({
        where: {
          creatorId,
          isActive: true,
        },
      });

      // Revenue from subscriptions
      const subscriptionRevenue = await prisma.transaction.aggregate({
        where: {
          creatorId,
          type: "SUBSCRIPTION",
          status: "COMPLETED",
          createdAt: { gte: startDate },
        },
        _sum: { amount: true },
      });

      return {
        data: {
          newSubscriptions,
          canceledSubscriptions,
          activeSubscriptions,
          revenue: subscriptionRevenue._sum.amount || 0,
          period,
        },
        error: null,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
