/**
 * Authentication Middleware
 *
 * Protects routes by verifying JWT tokens and attaching user data to request.
 * Supports optional role-based access control.
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { verifyToken, extractTokenFromHeader } from '../lib/jwt';

const prisma = new PrismaClient();

// Extend Express Request type to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: UserRole;
      };
    }
  }
}

/**
 * Require authentication middleware
 *
 * Verifies JWT token and attaches user to request.
 * Returns 401 if token is missing or invalid.
 *
 * @example
 * app.get('/api/profile', requireAuth, (req, res) => {
 *   console.log(req.user.id); // User ID from token
 * });
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
      return;
    }

    // Verify token
    const payload = verifyToken(token);

    // Fetch user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });

    if (!user) {
      res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found',
      });
      return;
    }

    // Attach user data to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.profile?.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Invalid token',
    });
  }
}

/**
 * Require specific role middleware
 *
 * Must be used after requireAuth. Checks if user has required role.
 *
 * @param role - Required user role (CREATOR or FAN)
 * @returns Express middleware function
 *
 * @example
 * app.post('/api/upload', requireAuth, requireRole('CREATOR'), (req, res) => {
 *   // Only creators can access this route
 * });
 */
export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'Must be authenticated to access this resource',
      });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({
        error: 'Forbidden',
        message: `This resource requires ${role} role`,
      });
      return;
    }

    next();
  };
}

/**
 * Optional authentication middleware
 *
 * Attaches user to request if token is present, but doesn't require it.
 * Useful for routes that behave differently for authenticated users.
 *
 * @example
 * app.get('/api/content', optionalAuth, (req, res) => {
 *   if (req.user) {
 *     // Show premium content
 *   } else {
 *     // Show free content only
 *   }
 * });
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      // No token provided, continue without user
      next();
      return;
    }

    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.profile?.role,
      };
    }

    next();
  } catch {
    // Invalid token, continue without user (don't block request)
    next();
  }
}

/**
 * Require creator role middleware (convenience)
 */
export const requireCreator = requireRole('CREATOR' as UserRole);

/**
 * Require fan role middleware (convenience)
 */
export const requireFan = requireRole('FAN' as UserRole);
