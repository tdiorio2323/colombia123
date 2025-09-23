import { Router } from "express";
import { Request, Response } from "express";
import { prisma, handlePrismaError } from "../lib/prisma";
import { z } from "zod";

const users = Router();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  passwordHash: z.string().min(1),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});

// Create a new user
users.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        passwordHash: validatedData.passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    res.status(201).json({ data: user });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get user by ID
users.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get user by email
users.get("/email/:email", async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Update user
users.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    res.json({ data: user });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Delete user
users.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

export { users };