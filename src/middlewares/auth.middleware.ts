// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, type Role } from '../utils/jwt';
import prisma from '../config/database';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

/**
 * Middleware to verify JWT Access Token (SRS NFR 1: Security)
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const payload = verifyToken(token);

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User not found or account deactivated',
      });
      return;
    }

    // Attach user to request for downstream use
    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to check user role (SRS NFR 10: Privacy & Access Control)
 * @param allowedRoles - Array of roles allowed to access the route
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient permissions',
      });
      return;
    }

    next();
  };
};