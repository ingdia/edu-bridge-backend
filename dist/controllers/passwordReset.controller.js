"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetTokenController = exports.resetPasswordController = exports.requestPasswordResetController = void 0;
const passwordReset_service_1 = require("../services/passwordReset.service");
const requestPasswordResetController = async (req, res) => {
    try {
        const { email } = req.body;
        await (0, passwordReset_service_1.requestPasswordReset)(email);
        res.status(200).json({
            message: 'If the email exists, a password reset link has been sent',
        });
    }
    catch (error) {
        console.error('Request password reset error:', error);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
};
exports.requestPasswordResetController = requestPasswordResetController;
const resetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        await (0, passwordReset_service_1.resetPassword)(token, newPassword);
        res.status(200).json({
            message: 'Password has been reset successfully',
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ error: error.message || 'Failed to reset password' });
    }
};
exports.resetPasswordController = resetPasswordController;
const verifyResetTokenController = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Token is required' });
        }
        const isValid = await (0, passwordReset_service_1.verifyResetToken)(token);
        res.status(200).json({ valid: isValid });
    }
    catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ error: 'Failed to verify token' });
    }
};
exports.verifyResetTokenController = verifyResetTokenController;
//# sourceMappingURL=passwordReset.controller.js.map