// src/controllers/passwordReset.controller.ts
import type { Request, Response } from 'express';
import {
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} from '../services/passwordReset.service';

export const requestPasswordResetController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await requestPasswordReset(email);

    res.status(200).json({
      message: 'If the email exists, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    await resetPassword(token, newPassword);

    res.status(200).json({
      message: 'Password has been reset successfully',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: error.message || 'Failed to reset password' });
  }
};

export const verifyResetTokenController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' });
    }

    const isValid = await verifyResetToken(token);

    res.status(200).json({ valid: isValid });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
};
