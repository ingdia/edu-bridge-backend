// src/validators/profile.validator.ts
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// UPDATE PROFILE SCHEMA (SRS FR 2.1 - 2.4)
// ─────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  // FR 2.1: Personal Data
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100)
    .trim()
    .optional(),

  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .optional(),

  nationalId: z
    .string()
    .regex(/^\d{16}$/, 'National ID must be 16 digits')
    .optional(),

  schoolName: z
    .string()
    .max(100)
    .trim()
    .optional(),

  gradeLevel: z
    .string()
    .max(50)
    .optional(),

  // FR 2.2: Parent/Guardian Info
  guardianName: z
    .string()
    .max(100)
    .trim()
    .optional()
    .nullable(),

  guardianContact: z
    .string()
    .max(20)
    .optional()
    .nullable(),

  relationship: z
    .string()
    .max(50)
    .optional()
    .nullable(),

  // FR 2.3: Socio-Economic (Sensitive - NFR 10)
  familyIncome: z
    .string()
    .max(50)
    .optional()
    .nullable(),

  occupation: z
    .string()
    .max(100)
    .optional()
    .nullable(),

  livingConditions: z
    .string()
    .max(200)
    .optional()
    .nullable(),

  // FR 2.4: Location
  homeAddress: z
    .string()
    .max(200)
    .trim()
    .optional()
    .nullable(),

  district: z
    .string()
    .max(50)
    .optional()
    .nullable(),

  province: z
    .string()
    .max(50)
    .optional()
    .nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ─────────────────────────────────────────────────────────────
// MENTOR NOTES SCHEMA (FR 2.5 - Confidential, Mentor/Admin Only)
// ─────────────────────────────────────────────────────────────

export const mentorNotesSchema = z.object({
  mentorNotes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .trim(),
});

export type MentorNotesInput = z.infer<typeof mentorNotesSchema>;

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

export const validateUpdateProfile = (data: unknown): UpdateProfileInput => {
  return updateProfileSchema.parse(data);
};

export const validateMentorNotes = (data: unknown): MentorNotesInput => {
  return mentorNotesSchema.parse(data);
};