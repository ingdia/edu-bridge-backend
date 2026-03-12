"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefreshToken = exports.validateLogin = exports.validateRegister = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
// src/validators/auth.validator.ts
const zod_1 = require("zod");
// ─────────────────────────────────────────────────────────────
// REGISTRATION SCHEMA (SRS FR 1, FR 2)
// ─────────────────────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    // FR 1.1: Capture and validate login name (email)
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters')
        .trim()
        .toLowerCase(),
    // FR 1.2: Capture and verify password securely
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
    // ✅ FIXED: Use z.enum() with string literals instead of z.nativeEnum(Role)
    role: zod_1.z.enum(['STUDENT', 'MENTOR', 'ADMIN']).default('STUDENT'),
    gradeLevel: zod_1.z
        .string()
        .min(2, 'Grade level must be at least 2 characters')
        .max(50, 'Grade level must be less than 50 characters')
        .trim()
        .optional(),
    // FR 2.1: Personal data (required for students)
    fullName: zod_1.z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100)
        .trim()
        .optional(),
    nationalId: zod_1.z
        .string()
        .regex(/^\d{16}$/, 'National ID must be 16 digits') // Rwanda format
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
        .optional(),
    // FR 2.2: Parent/Guardian info (optional at registration)
    guardianName: zod_1.z.string().max(100).trim().optional(),
    guardianContact: zod_1.z.string().max(20).optional(),
});
// ─────────────────────────────────────────────────────────────
// LOGIN SCHEMA (SRS FR 1.1, FR 1.2)
// ─────────────────────────────────────────────────────────────
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .trim()
        .toLowerCase(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// ─────────────────────────────────────────────────────────────
// TOKEN REFRESH SCHEMA
// ─────────────────────────────────────────────────────────────
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
// ─────────────────────────────────────────────────────────────
// HELPER: Validate and parse input
// ─────────────────────────────────────────────────────────────
const validateRegister = (data) => {
    return exports.registerSchema.parse(data);
};
exports.validateRegister = validateRegister;
const validateLogin = (data) => {
    return exports.loginSchema.parse(data);
};
exports.validateLogin = validateLogin;
const validateRefreshToken = (data) => {
    return exports.refreshTokenSchema.parse(data);
};
exports.validateRefreshToken = validateRefreshToken;
//# sourceMappingURL=auth.validator.js.map