import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-change-in-production";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "15m"; // Short-lived access tokens
const REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
const SALT_ROUNDS = 12;

// JWT Token interface
export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  jti?: string; // JWT ID for tracking
}

export interface RefreshTokenPayload {
  userId: string;
  tokenFamily: string;
  jti: string;
}

// Extended Request interface for authenticated routes
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string;
    profile?: any;
  };
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

// Generate refresh token
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN as any });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Get user with profile from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    req.user = {
      ...user,
      role: user.profile?.role || 'USER'
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// Optional authentication middleware (doesn't require token)
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const payload = verifyToken(token);
      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            name: true,
            profile: true,
          },
        });

        if (user) {
          req.user = {
      ...user,
      role: user.profile?.role || 'USER'
    };
        }
      }
    } catch (error) {
      // Ignore errors in optional auth
    }
  }

  next();
}

// Role-based authorization middleware
export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.profile) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (req.user.profile.role !== role) {
      return res.status(403).json({ error: `${role} role required` });
    }

    next();
  };
}

// Creator-only middleware
export function requireCreator(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return requireRole("CREATOR")(req, res, next);
}

// Admin-only middleware
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return requireRole("ADMIN")(req, res, next);
}