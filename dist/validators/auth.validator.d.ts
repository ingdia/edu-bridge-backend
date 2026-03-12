import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["STUDENT", "MENTOR", "ADMIN"]>>;
    gradeLevel: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    nationalId: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    guardianName: z.ZodOptional<z.ZodString>;
    guardianContact: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role: "STUDENT" | "MENTOR" | "ADMIN";
    gradeLevel?: string | undefined;
    fullName?: string | undefined;
    nationalId?: string | undefined;
    dateOfBirth?: string | undefined;
    guardianName?: string | undefined;
    guardianContact?: string | undefined;
}, {
    email: string;
    password: string;
    role?: "STUDENT" | "MENTOR" | "ADMIN" | undefined;
    gradeLevel?: string | undefined;
    fullName?: string | undefined;
    nationalId?: string | undefined;
    dateOfBirth?: string | undefined;
    guardianName?: string | undefined;
    guardianContact?: string | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export declare const validateRegister: (data: unknown) => RegisterInput;
export declare const validateLogin: (data: unknown) => LoginInput;
export declare const validateRefreshToken: (data: unknown) => RefreshTokenInput;
//# sourceMappingURL=auth.validator.d.ts.map