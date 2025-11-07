import { prisma, handlePrismaError } from "../lib/prisma";
import { UserRole } from "@shared/api";

export class UserService {
  // Find user by email
  static async findByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
        },
      });
      return { data: user, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Find user by ID
  static async findById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });
      return { data: user, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Create new user with profile
  static async create(data: {
    email: string;
    name?: string;
    passwordHash?: string;
    username: string;
    displayName?: string;
    role: UserRole;
    stripeCustomerId?: string;
  }) {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash: data.passwordHash,
          stripeCustomerId: data.stripeCustomerId,
          profile: {
            create: {
              username: data.username,
              displayName: data.displayName || data.username,
              role: data.role,
              tipEnabled: data.role === "CREATOR",
            },
          },
        },
        include: {
          profile: true,
        },
      });
      return { data: user, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Update user profile
  static async updateProfile(
    userId: string,
    updates: {
      username?: string;
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
      subscriptionPrice?: number;
      tipEnabled?: boolean;
      stripeAccountId?: string;
    },
  ) {
    try {
      const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: updates,
        include: {
          user: true,
        },
      });
      return { data: updatedProfile, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get user with full profile data
  static async getFullProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              media: {
                orderBy: { createdAt: "desc" },
                take: 10,
              },
              createdSubscriptions: {
                where: { isActive: true },
                include: {
                  subscriber: {
                    include: { profile: true },
                  },
                },
              },
              transactions: {
                orderBy: { createdAt: "desc" },
                take: 20,
                include: {
                  buyer: { include: { profile: true } },
                  media: true,
                },
              },
            },
          },
          subscriptions: {
            where: { isActive: true },
            include: {
              creator: true,
            },
          },
        },
      });
      return { data: user, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Update user earnings after successful transaction
  static async updateEarnings(
    creatorId: string,
    amount: number,
    type: "SUBSCRIPTION" | "TIP" | "MEDIA_PURCHASE",
  ) {
    try {
      // Update profile total earnings
      await prisma.profile.update({
        where: { id: creatorId },
        data: {
          totalEarnings: {
            increment: amount,
          },
        },
      });

      // Update or create daily earnings record
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const earnings = await prisma.creatorEarning.upsert({
        where: {
          creatorId_date: {
            creatorId,
            date: today,
          },
        },
        update: {
          [type.toLowerCase() + "s"]: { increment: amount },
          totalGross: { increment: amount },
          platformFee: { increment: Math.floor(amount * 0.2) }, // 20% platform fee
          totalNet: { increment: Math.floor(amount * 0.8) },
        },
        create: {
          creatorId,
          date: today,
          [type.toLowerCase() + "s"]: amount,
          totalGross: amount,
          platformFee: Math.floor(amount * 0.2),
          totalNet: Math.floor(amount * 0.8),
        },
      });

      return { data: earnings, error: null };
    } catch (error) {
      return handlePrismaError(error);
    }
  }

  // Get creator analytics
  static async getCreatorAnalytics(creatorId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const earnings = await prisma.creatorEarning.findMany({
        where: {
          creatorId,
          date: {
            gte: startDate,
          },
        },
        orderBy: { date: "asc" },
      });

      const totalStats = await prisma.creatorEarning.aggregate({
        where: { creatorId },
        _sum: {
          subscriptions: true,
          tips: true,
          mediaSales: true,
          totalGross: true,
          platformFee: true,
          totalNet: true,
        },
      });

      return {
        data: {
          dailyEarnings: earnings,
          totals: totalStats._sum,
        },
        error: null,
      };
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
