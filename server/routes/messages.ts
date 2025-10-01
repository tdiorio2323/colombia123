import { Router } from "express";
import { Request, Response } from "express";
import { prisma, handlePrismaError } from "../lib/prisma";
import { z } from "zod";

const messages = Router();

// Validation schemas
const createMessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1).max(1000),
});

// Send a message
messages.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = createMessageSchema.parse(req.body);

    const message = await prisma.message.create({
      data: {
        senderId: validatedData.senderId,
        receiverId: validatedData.receiverId,
        content: validatedData.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({ data: message });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get message by ID
messages.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ data: message });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get conversation between two users
messages.get("/conversation/:userId1/:userId2", async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;
    const { limit = "50", offset = "0" } = req.query;

    const conversation = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({ data: conversation });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get user's conversations (list of users they've messaged with)
messages.get("/conversations/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get unique conversation partners
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ["receiverId"],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ["senderId"],
    });

    // Combine and get unique user IDs
    const partnerIds = new Set([
      ...sentMessages.map((m) => m.receiverId),
      ...receivedMessages.map((m) => m.senderId),
    ]);

    // Get user details for each conversation partner
    const conversations = await Promise.all(
      Array.from(partnerIds).map(async (partnerId) => {
        // Get the latest message in this conversation
        const latestMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: partnerId },
              { senderId: partnerId, receiverId: userId },
            ],
          },
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                profile: {
                  select: {
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        });

        // Get unread count for this conversation
        const unreadCount = await prisma.message.count({
          where: {
            senderId: partnerId,
            receiverId: userId,
            isRead: false,
          },
        });

        // Get partner's profile
        const partner = await prisma.user.findUnique({
          where: { id: partnerId },
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                username: true,
                displayName: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        });

        return {
          partner,
          latestMessage,
          unreadCount,
        };
      })
    );

    // Sort by latest message date
    conversations.sort((a, b) => {
      const aTime = a.latestMessage?.createdAt || new Date(0);
      const bTime = b.latestMessage?.createdAt || new Date(0);
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    res.json({ data: conversations });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Mark message as read
messages.post("/:id/read", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({ data: message });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Mark all messages in a conversation as read
messages.post("/conversation/:senderId/:receiverId/read", async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.params;

    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

export { messages };