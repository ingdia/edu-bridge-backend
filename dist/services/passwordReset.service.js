"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.resetPassword = exports.requestPasswordReset = void 0;
// src/services/passwordReset.service.ts
const crypto_1 = __importDefault(require("crypto"));
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const email_service_1 = require("./email.service");
const logger_1 = require("../utils/logger");
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
const requestPasswordReset = async (email) => {
    const user = await database_1.default.user.findUnique({
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
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);
    // Invalidate any existing unused tokens
    await database_1.default.passwordResetToken.updateMany({
        where: {
            userId: user.id,
            used: false,
        },
        data: {
            used: true,
        },
    });
    // Create new reset token
    await database_1.default.passwordResetToken.create({
        data: {
            userId: user.id,
            token,
            expiresAt,
        },
    });
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const userName = user.studentProfile?.fullName || email.split('@')[0];
    await (0, email_service_1.sendEmail)({
        to: email,
        subject: 'Password Reset Request - EDU-Bridge',
        template: 'password-reset',
        data: {
            userName,
            resetUrl,
            expiryMinutes: 60,
        },
    });
    await (0, logger_1.logAudit)(user.id, 'PASSWORD_RESET_REQUESTED', { email });
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (token, newPassword) => {
    const resetToken = await database_1.default.passwordResetToken.findUnique({
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
    const hashedPassword = await (0, password_1.hashPassword)(newPassword);
    // Update password
    await database_1.default.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
    });
    // Mark token as used
    await database_1.default.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
    });
    // Revoke all refresh tokens (force re-login)
    await database_1.default.refreshToken.updateMany({
        where: { userId: resetToken.userId },
        data: { revoked: true },
    });
    await (0, logger_1.logAudit)(resetToken.userId, 'PASSWORD_RESET_COMPLETED', { email: resetToken.user.email });
};
exports.resetPassword = resetPassword;
const verifyResetToken = async (token) => {
    const resetToken = await database_1.default.passwordResetToken.findUnique({
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
exports.verifyResetToken = verifyResetToken;
//# sourceMappingURL=passwordReset.service.js.map