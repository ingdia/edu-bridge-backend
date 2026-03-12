import { z } from 'zod';
export declare const updateProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    nationalId: z.ZodOptional<z.ZodString>;
    schoolName: z.ZodOptional<z.ZodString>;
    gradeLevel: z.ZodOptional<z.ZodString>;
    guardianName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    guardianContact: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    relationship: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    familyIncome: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    occupation: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    livingConditions: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    homeAddress: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    district: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    province: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    gradeLevel?: string | undefined;
    fullName?: string | undefined;
    nationalId?: string | undefined;
    dateOfBirth?: string | undefined;
    guardianName?: string | null | undefined;
    guardianContact?: string | null | undefined;
    schoolName?: string | undefined;
    relationship?: string | null | undefined;
    familyIncome?: string | null | undefined;
    occupation?: string | null | undefined;
    livingConditions?: string | null | undefined;
    homeAddress?: string | null | undefined;
    district?: string | null | undefined;
    province?: string | null | undefined;
}, {
    gradeLevel?: string | undefined;
    fullName?: string | undefined;
    nationalId?: string | undefined;
    dateOfBirth?: string | undefined;
    guardianName?: string | null | undefined;
    guardianContact?: string | null | undefined;
    schoolName?: string | undefined;
    relationship?: string | null | undefined;
    familyIncome?: string | null | undefined;
    occupation?: string | null | undefined;
    livingConditions?: string | null | undefined;
    homeAddress?: string | null | undefined;
    district?: string | null | undefined;
    province?: string | null | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export declare const mentorNotesSchema: z.ZodObject<{
    mentorNotes: z.ZodString;
}, "strip", z.ZodTypeAny, {
    mentorNotes: string;
}, {
    mentorNotes: string;
}>;
export type MentorNotesInput = z.infer<typeof mentorNotesSchema>;
export declare const validateUpdateProfile: (data: unknown) => UpdateProfileInput;
export declare const validateMentorNotes: (data: unknown) => MentorNotesInput;
//# sourceMappingURL=profile.validator.d.ts.map