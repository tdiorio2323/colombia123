import { prisma, handlePrismaError } from "../lib/prisma";
import { TransactionType, TransactionStatus } from "@shared/api";

export class TransactionService {
  // Create new transaction
  static async create(data: {
    buyerId: string;
    creatorId: string;
    mediaId?: string;
    type: TransactionType;
    amount: number;
    currency?: string;
    stripePiId?: string;
    description?: string;
  }) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          buyerId: data.buyerId,
          creatorId: data.creatorId,
          mediaId: data.mediaId,
          type: data.type,
          amount: data.amount,
          currency: data.currency || "usd",
          stripePiId: data.stripePiId,
          description: data.description,
          status: "PENDING",
        },
        include: {
          buyer: { include: { profile: true } },
          creator: true,
          media: true,
        },
      });

      return { data: transaction, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Update transaction status (for Stripe webhook handling)
  static async updateStatus(
    stripePiId: string,
    status: TransactionStatus,
    description?: string,
  ) {
    try {
      const transaction = await prisma.transaction.update({
        where: { stripePiId },
        data: {
          status,
          ...(description && { description }),
          updatedAt: new Date(),
        },
        include: {
          buyer: { include: { profile: true } },
          creator: true,
          media: true,
        },
      });

      // If transaction is completed, update earnings
      if (status === "COMPLETED") {
        await this.updateCreatorEarnings(transaction);
      }

      return { data: transaction, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Update creator earnings after successful transaction
  private static async updateCreatorEarnings(transaction: any) {
    const grossAmount = transaction.amount;
    const platformFeeRate = 0.2; // 20%
    const stripeFeeRate = 0.029; // 2.9%
    const stripeFeeFixed = 30; // $0.30 in cents

    const stripeFee = Math.round(grossAmount * stripeFeeRate) + stripeFeeFixed;
    const netAmount = grossAmount - stripeFee;
    const platformFee = Math.round(netAmount * platformFeeRate);
    const creatorEarnings = netAmount - platformFee;

    // Update profile total earnings
    await prisma.profile.update({
      where: { id: transaction.creatorId },
      data: {
        totalEarnings: { increment: creatorEarnings },
      },
    });

    // Update fan total spent
    await prisma.profile.update({
      where: { userId: transaction.buyerId },
      data: {
        totalSpent: { increment: grossAmount },
      },
    });

    // Update daily earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const earningsField = transaction.type.toLowerCase() + "s";

    await prisma.creatorEarning.upsert({
      where: {
        creatorId_date: {
          creatorId: transaction.creatorId,
          date: today,
        },
      },
      update: {
        [earningsField]: { increment: creatorEarnings },
        totalGross: { increment: grossAmount },
        platformFee: { increment: platformFee },
        stripeFee: { increment: stripeFee },
        totalNet: { increment: creatorEarnings },
      },
      create: {
        creatorId: transaction.creatorId,
        date: today,
        [earningsField]: creatorEarnings,
        totalGross: grossAmount,
        platformFee,
        stripeFee,
        totalNet: creatorEarnings,
      },
    });
  }

  // Get user transactions
  static async getUserTransactions(
    userId: string,
    type: "buyer" | "creator" | "all" = "all",
    limit = 50,
  ) {
    try {
      let whereClause: any = {};

      if (type === "buyer") {
        whereClause.buyerId = userId;
      } else if (type === "creator") {
        whereClause.creatorId = userId;
      } else {
        whereClause = {
          OR: [{ buyerId: userId }, { creatorId: userId }],
        };
      }

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        include: {
          buyer: { include: { profile: true } },
          creator: true,
          media: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return { data: transactions, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get transaction by ID
  static async getById(id: string) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          buyer: { include: { profile: true } },
          creator: true,
          media: true,
        },
      });

      return { data: transaction, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get transaction analytics
  static async getAnalytics(
    creatorId?: string,
    period: "day" | "week" | "month" | "year" = "month",
  ) {
    try {
      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case "day":
          startDate.setDate(now.getDate() - 1);
          break;
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

      const whereClause: any = {
        createdAt: { gte: startDate },
        status: "COMPLETED",
      };

      if (creatorId) {
        whereClause.creatorId = creatorId;
      }

      // Total revenue by type
      const revenueByType = await prisma.transaction.groupBy({
        by: ["type"],
        where: whereClause,
        _sum: { amount: true },
        _count: { _all: true },
      });

      // Total revenue
      const totalRevenue = await prisma.transaction.aggregate({
        where: whereClause,
        _sum: { amount: true },
        _count: { _all: true },
      });

      // Daily revenue breakdown
      const dailyRevenue = await prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          SUM(amount) as revenue,
          COUNT(*) as transactions
        FROM transactions
        WHERE created_at >= ${startDate}
          AND status = 'COMPLETED'
          ${creatorId ? prisma.$queryRaw`AND creator_id = ${creatorId}` : prisma.$queryRaw``}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      return {
        data: {
          totalRevenue: totalRevenue._sum.amount || 0,
          totalTransactions: totalRevenue._count || 0,
          revenueByType,
          dailyRevenue,
          period,
        },
        error: null,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Process tip with message
  static async processTip(data: {
    buyerId: string;
    creatorId: string;
    amount: number;
    message?: string;
    stripePiId?: string;
  }) {
    try {
      const transaction = await this.create({
        buyerId: data.buyerId,
        creatorId: data.creatorId,
        type: "TIP",
        amount: data.amount,
        stripePiId: data.stripePiId,
        description: data.message,
      });

      return transaction;
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get pending transactions (for cleanup jobs)
  static async getPendingTransactions(olderThanMinutes = 30) {
    try {
      const cutoffTime = new Date();
      cutoffTime.setMinutes(cutoffTime.getMinutes() - olderThanMinutes);

      const transactions = await prisma.transaction.findMany({
        where: {
          status: "PENDING",
          createdAt: { lte: cutoffTime },
        },
        include: {
          buyer: { include: { profile: true } },
          creator: true,
          media: true,
        },
      });

      return { data: transactions, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
