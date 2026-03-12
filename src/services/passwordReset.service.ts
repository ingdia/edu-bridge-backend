// src/services/passwordReset.service.ts
import crypto from 'crypto';
import prisma from '../config/database';
import { hashPassword } from '../utils/password';
import { sendEmail } from './email.service';
import { logAudit } from '../utils/logger';

const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      studentProfile: { select: { fullName: true } },
      mentorProfile: { select: { userId: true } },
      adminProfile: { select: { userId: true } },
    },
  });

  if (!user) {
    // Don't reveal if email exists (security best practice)
    return;
  }

  // Generate secure random token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  // Invalidate any existing unused tokens
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      used: false,
    },
    data: {
      used: true,
    },
  });

  // Create new reset token
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // Send reset email
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const userName = user.studentProfile?.fullName || email.split('@')[0];

  await sendEmail({
    to: email,
    subject: 'Password Reset Request - EDU-Bridge',
    template: 'password-reset',
    data: {
      userName,
      resetUrl,
      expiryMinutes: 60,
    },
  });

  await logAudit(user.id, 'PASSWORD_RESET_REQUESTED', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.used) {
    throw new Error('Invalid or expired reset token');
  }

  if (new Date() > resetToken.expiresAt) {
    throw new Error('Reset token has expired');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { used: true },
  });

  // Revoke all refresh tokens (force re-login)
  await prisma.refreshToken.updateMany({
    where: { userId: resetToken.userId },
    data: { revoked: true },
  });

  await logAudit(resetToken.userId, 'PASSWORD_RESET_COMPLETED', { email: resetToken.user.email });
};

export const verifyResetToken = async (token: string): Promise<boolean> => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.used) {
    return false;
  }

  if (new Date() > resetToken.expiresAt) {
    return false;
  }

  return true;
};
