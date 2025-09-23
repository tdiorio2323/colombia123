import { Router } from "express";
import { Request, Response } from "express";
import { prisma, handlePrismaError } from "../lib/prisma";
import { z } from "zod";

const profiles = Router();

// Validation schemas
const createProfileSchema = z.object({
  userId: z.string(),
  username: z.string().min(3).max(30),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["CREATOR", "FAN", "ADMIN"]).default("FAN"),
});

const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["CREATOR", "FAN", "ADMIN"]).optional(),
  subscriptionPrice: z.number().min(0).optional(),
  tipEnabled: z.boolean().optional(),
  stripeAccountId: z.string().optional(),
});

// Create a new profile
profiles.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = createProfileSchema.parse(req.body);

    const profile = await prisma.profile.create({
      data: {
        userId: validatedData.userId,
        username: validatedData.username,
        displayName: validatedData.displayName,
        bio: validatedData.bio,
        avatarUrl: validatedData.avatarUrl,
        role: validatedData.role,
        tipEnabled: validatedData.role === "CREATOR",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({ data: profile });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get profile by ID
profiles.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ data: profile });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get profile by username
profiles.get("/username/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ data: profile });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get all creators
profiles.get("/creators", async (req: Request, res: Response) => {
  try {
    const creators = await prisma.profile.findMany({
      where: { role: "CREATOR" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        subscriberCount: "desc",
      },
    });

    res.json({ data: creators });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Update profile
profiles.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateProfileSchema.parse(req.body);

    const profile = await prisma.profile.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.json({ data: profile });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Delete profile
profiles.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.profile.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

export { profiles };