"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenSchema = exports.resetPasswordSchema = exports.requestPasswordResetSchema = void 0;
// src/validators/passwordReset.validator.ts
const zod_1 = require("zod");
exports.requestPasswordResetSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required'),
    newPassword: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
exports.verifyTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required'),
});
//# sourceMappingURL=passwordReset.validator.js.map