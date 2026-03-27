// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, logoutUser } from '../services/auth.service';
import { validateRegister, validateLogin, validateRefreshToken } from '../validators/auth.validator';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/database';
import { env } from '../config/env';
import { sendWelcomeEmail } from '../services/email.service';

// ─────────────────────────────────────────────────────────────
// REGISTER CONTROLLER (SRS FR 1, FR 2)
// ─────────────────────────────────────────────────────────────

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = validateRegister(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const result = await registerUser(validatedData, ipAddress);

    res.status(201).json({
      success: true,
      message: result.message,
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// LOGIN CONTROLLER (SRS FR 1.1, FR 1.2)
// ─────────────────────────────────────────────────────────────

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = validateLogin(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const result = await loginUser(validatedData, ipAddress);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// LOGOUT CONTROLLER (NFR 5: Auditability)
// ─────────────────────────────────────────────────────────────

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    await logoutUser(userId, refreshToken, ipAddress);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// REFRESH TOKEN CONTROLLER
// ─────────────────────────────────────────────────────────────

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = validateRefreshToken(req.body);

    // Verify the refresh token
    const payload = verifyToken(refreshToken);

    // Check if token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: payload.userId,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedToken) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
      return;
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
      env.JWT_SECRET, // ← Use env.JWT_SECRET instead of process.env
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET CURRENT USER CONTROLLER (FR 1: Authentication)
// ─────────────────────────────────────────────────────────────

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        studentProfile: {
          select: {
            fullName: true,
            nationalId: true,
            schoolName: true,
            gradeLevel: true,
          },
        },
        mentorProfile: {
          select: {
            expertise: true,
            bio: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// VERIFY EMAIL CONTROLLER
// ─────────────────────────────────────────────────────────────

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.query as { token: string };

    if (!token) {
      res.status(400).json({ success: false, message: 'Verification token is required' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        emailVerified: false,
        verificationTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    // Send welcome email after verification
    const displayName = user.email.split('@')[0];
    sendWelcomeEmail(user.email, displayName, {
      email: user.email,
      role: user.role,
      schoolName: 'GS Ruyenzi',
      isStudent: user.role === 'STUDENT',
      isMentor: user.role === 'MENTOR',
      isAdmin: user.role === 'ADMIN',
      platformUrl: env.FRONTEND_URL,
    });

    res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};
