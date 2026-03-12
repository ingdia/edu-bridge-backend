"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMentorNotes = exports.validateUpdateProfile = exports.mentorNotesSchema = exports.updateProfileSchema = void 0;
// src/validators/profile.validator.ts
const zod_1 = require("zod");
// ─────────────────────────────────────────────────────────────
// UPDATE PROFILE SCHEMA (SRS FR 2.1 - 2.4)
// ─────────────────────────────────────────────────────────────
exports.updateProfileSchema = zod_1.z.object({
    // FR 2.1: Personal Data
    fullName: zod_1.z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100)
        .trim()
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
        .optional(),
    nationalId: zod_1.z
        .string()
        .regex(/^\d{16}$/, 'National ID must be 16 digits')
        .optional(),
    schoolName: zod_1.z
        .string()
        .max(100)
        .trim()
        .optional(),
    gradeLevel: zod_1.z
        .string()
        .max(50)
        .optional(),
    // FR 2.2: Parent/Guardian Info
    guardianName: zod_1.z
        .string()
        .max(100)
        .trim()
        .optional()
        .nullable(),
    guardianContact: zod_1.z
        .string()
        .max(20)
        .optional()
        .nullable(),
    relationship: zod_1.z
        .string()
        .max(50)
        .optional()
        .nullable(),
    // FR 2.3: Socio-Economic (Sensitive - NFR 10)
    familyIncome: zod_1.z
        .string()
        .max(50)
        .optional()
        .nullable(),
    occupation: zod_1.z
        .string()
        .max(100)
        .optional()
        .nullable(),
    livingConditions: zod_1.z
        .string()
        .max(200)
        .optional()
        .nullable(),
    // FR 2.4: Location
    homeAddress: zod_1.z
        .string()
        .max(200)
        .trim()
        .optional()
        .nullable(),
    district: zod_1.z
        .string()
        .max(50)
        .optional()
        .nullable(),
    province: zod_1.z
        .string()
        .max(50)
        .optional()
        .nullable(),
});
// ─────────────────────────────────────────────────────────────
// MENTOR NOTES SCHEMA (FR 2.5 - Confidential, Mentor/Admin Only)
// ─────────────────────────────────────────────────────────────
exports.mentorNotesSchema = zod_1.z.object({
    mentorNotes: zod_1.z
        .string()
        .max(2000, 'Notes must be less than 2000 characters')
        .trim(),
});
// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
const validateUpdateProfile = (data) => {
    return exports.updateProfileSchema.parse(data);
};
exports.validateUpdateProfile = validateUpdateProfile;
const validateMentorNotes = (data) => {
    return exports.mentorNotesSchema.parse(data);
};
exports.validateMentorNotes = validateMentorNotes;
//# sourceMappingURL=profile.validator.js.map