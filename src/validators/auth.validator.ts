// src/validators/auth.validator.ts
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// REGISTRATION SCHEMA (SRS FR 1, FR 2)
// ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  // FR 1.1: Capture and validate login name (email)
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters')
    .trim()
    .toLowerCase(),

  // FR 1.2: Capture and verify password securely
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),

  // ✅ FIXED: Use z.enum() with string literals instead of z.nativeEnum(Role)
  role: z.enum(['STUDENT', 'MENTOR', 'ADMIN'] as const).default('STUDENT'),
  
   gradeLevel: z
    .string()
    .min(2, 'Grade level must be at least 2 characters')
    .max(50, 'Grade level must be less than 50 characters')
    .trim()
    .optional(),

  // FR 2.1: Personal data (required for students)
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100)
    .trim()
    .optional(),

  nationalId: z
    .string()
    .regex(/^\d{16}$/, 'National ID must be 16 digits')
    .optional()
    .or(z.literal(''))
    .transform((v) => v === '' ? undefined : v),

  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .optional(),

  // FR 2.2: Parent/Guardian info (optional at registration)
  guardianName: z.string().max(100).trim().optional(),
  guardianContact: z.string().max(20).optional(),
  schoolId: z.string().uuid().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─────────────────────────────────────────────────────────────
// LOGIN SCHEMA (SRS FR 1.1, FR 1.2)
// ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .trim()
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────────────────────
// TOKEN REFRESH SCHEMA
// ─────────────────────────────────────────────────────────────

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// ─────────────────────────────────────────────────────────────
// HELPER: Validate and parse input
// ─────────────────────────────────────────────────────────────

export const validateRegister = (data: unknown): RegisterInput => {
  return registerSchema.parse(data);
};

export const validateLogin = (data: unknown): LoginInput => {
  return loginSchema.parse(data);
};

export const validateRefreshToken = (data: unknown): RefreshTokenInput => {
  return refreshTokenSchema.parse(data);
};