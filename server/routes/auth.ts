import { Router } from "express";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma, handlePrismaError } from "../lib/prisma";
import { hashPassword, verifyPassword, generateToken, JWTPayload } from "../lib/auth";
import jwt from "jsonwebtoken";

const auth = Router();

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3).max(30),
  role: z.enum(["CREATOR", "FAN"]).default("FAN"),
  displayName: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Sign up
auth.post("/signup", async (req: Request, res: Response) => {
  try {
    const validatedData = signUpSchema.parse(req.body);
    const { email, password, username, role, displayName } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Check if username is taken
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name: displayName,
        },
      });

      // Create profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          username,
          displayName: displayName || username,
          role,
          tipEnabled: role === "CREATOR",
        },
      });

      return { user, profile };
    });

    // Generate JWT token
    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.profile.role,
    });

    // Return user data without password
    res.status(201).json({
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          createdAt: result.user.createdAt,
        },
        profile: result.profile,
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Sign in
auth.post("/signin", async (req: Request, res: Response) => {
  try {
    const validatedData = signInSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user with profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.profile?.role,
    });

    // Return user data without password
    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        profile: user.profile,
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Get current user (requires authentication)
auth.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // This would typically use the authenticateToken middleware
    // For now, we'll implement it inline
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          profile: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ data: user });
    } catch (jwtError) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Change password
auth.post("/change-password", async (req: Request, res: Response) => {
  try {
    const changePasswordSchema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8, "New password must be at least 8 characters"),
    });

    const validatedData = changePasswordSchema.parse(req.body);
    const { currentPassword, newPassword } = validatedData;

    // Get user ID from token (this should use middleware in production)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || !user.passwordHash) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      res.json({ message: "Password updated successfully" });
    } catch (jwtError) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

// Refresh token
auth.post("/refresh", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          profile: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate new token
      const newToken = generateToken({
        userId: user.id,
        email: user.email,
        role: user.profile?.role,
      });

      res.json({ data: { token: newToken } });
    } catch (jwtError) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    const dbError = handlePrismaError(error);
    res.status(500).json(dbError);
  }
});

export { auth };