// src/services/auth.service.ts
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, type Role } from '../utils/jwt';
import { logAudit } from '../utils/logger';
import { sendWelcomeEmail, sendEmail } from './email.service';
import { env } from '../config/env';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────
// REGISTER SERVICE (SRS FR 1, FR 2)
// ─────────────────────────────────────────────────────────────

export interface RegisterOutput {
  user: {
    id: string;
    email: string;
    role: Role;
  };
  message: string;
}

export const registerUser = async (
  data: RegisterInput,
  ipAddress?: string
): Promise<RegisterOutput> => {
  const { email, password, role, fullName, nationalId, dateOfBirth, gradeLevel, guardianName, guardianContact } = data;

  // FR 1.1: Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // FR 1.2: Hash password securely (NFR 1)
  const hashedPassword = await hashPassword(password);

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user with role (SRS 2.3: User Classes)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role as Role,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
    },
  });

  // FR 2: Create student profile if role is STUDENT
  if (role === 'STUDENT' && fullName && nationalId && dateOfBirth) {
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gradeLevel: gradeLevel || 'Senior Four',
        nationalId,
        guardianName: guardianName || null,
        guardianContact: guardianContact || null,
      },
    });
  }

  // NFR 5: Audit logging
  await logAudit(user.id, 'USER_REGISTER', { email, role }, ipAddress);

  // Send verification email (non-blocking)
  const displayName = fullName || email.split('@')[0];
  const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  sendEmail({
    to: email,
    subject: '✉️ Verify your EDU-Bridge email',
    template: 'verify-email',
    data: { userName: displayName, verificationUrl },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role as Role,
    },
    message: 'Registration successful. Please check your email to verify your account.',
  };
};

// ─────────────────────────────────────────────────────────────
// LOGIN SERVICE (SRS FR 1.1, FR 1.2)
// ─────────────────────────────────────────────────────────────

export interface LoginOutput {
  user: {
    id: string;
    email: string;
    role: Role;
    fullName?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  data: LoginInput,
  ipAddress?: string
): Promise<LoginOutput> => {
  const { email, password } = data;

  // FR 1.1: Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      studentProfile: {
        select: {
          fullName: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // FR 1.2: Verify password (NFR 1: Security)
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error('Account is deactivated. Contact administrator.');
  }

  // Block login if email not verified
  if (!user.emailVerified) {
    throw new Error('Please verify your email before logging in. Check your inbox.');
  }

  // Generate JWT tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role as Role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role as Role,
  });

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress: ipAddress || null,
    },
  });

  // Update last login timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
    },
  });

  // NFR 5: Audit logging
  await logAudit(user.id, 'USER_LOGIN', { email, role: user.role }, ipAddress);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      fullName: user.studentProfile?.fullName || undefined,
    },
    accessToken,
    refreshToken,
  };
};

// ─────────────────────────────────────────────────────────────
// LOGOUT SERVICE (NFR 5: Auditability)
// ─────────────────────────────────────────────────────────────

export const logoutUser = async (
  userId: string,
  token: string,
  ipAddress?: string
): Promise<void> => {
  // Revoke refresh token
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      token,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });

  // NFR 5: Audit logging
  await logAudit(userId, 'USER_LOGOUT', { tokenRevoked: true }, ipAddress);
};
