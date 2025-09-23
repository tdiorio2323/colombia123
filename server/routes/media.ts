import { Router } from "express";
import { Request, Response } from "express";
import { prisma, handlePrismaError } from "../lib/prisma";
import { z } from "zod";

const media = Router();

// Validation schemas
const createMediaSchema = z.object({
  creatorId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  mediaUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  mediaType: z.enum(["IMAGE", "VIDEO", "AUDIO"]),
  isPremium: z.boolean().default(false),
  price: z.number().min(0).optional(),
});

const updateMediaSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  isPremium: z.boolean().optional(),
  price: z.number().min(0).optional(),
});

// Create new media
media.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = createMediaSchema.parse(req.body);

    const newMedia = await prisma.media.create({
      data: {
        creatorId: validatedData.creatorId,
        title: validatedData.title,
        description: validatedData.description,
        mediaUrl: validatedData.mediaUrl,
        thumbnailUrl: validatedData.thumbnailUrl,
        mediaType: validatedData.mediaType,
        isPremium: validatedData.isPremium,
        price: validatedData.price,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update creator's media count
    await prisma.profile.update({
      where: { id: validatedData.creatorId },
      data: {
        mediaCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({ data: newMedia });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get media by ID
media.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mediaItem = await prisma.media.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!mediaItem) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Increment view count
    await prisma.media.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    res.json({ data: mediaItem });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get media by creator
media.get("/creator/:creatorId", async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { limit = "20", offset = "0" } = req.query;

    const mediaItems = await prisma.media.findMany({
      where: { creatorId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({ data: mediaItems });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get all public media (non-premium)
media.get("/", async (req: Request, res: Response) => {
  try {
    const { limit = "20", offset = "0", type } = req.query;

    const where: any = { isPremium: false };
    if (type && ["IMAGE", "VIDEO", "AUDIO"].includes(type as string)) {
      where.mediaType = type;
    }

    const mediaItems = await prisma.media.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({ data: mediaItems });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Update media
media.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateMediaSchema.parse(req.body);

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: validatedData,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json({ data: updatedMedia });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Delete media
media.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const mediaItem = await prisma.media.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!mediaItem) {
      return res.status(404).json({ error: "Media not found" });
    }

    await prisma.media.delete({
      where: { id },
    });

    // Update creator's media count
    await prisma.profile.update({
      where: { id: mediaItem.creatorId },
      data: {
        mediaCount: {
          decrement: 1,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Like media
media.post("/:id/like", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        likeCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        likeCount: true,
      },
    });

    res.json({ data: updatedMedia });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

export { media };