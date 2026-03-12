import { z } from 'zod';
export declare const createCVSchema: z.ZodObject<{
    content: z.ZodRecord<z.ZodString, z.ZodAny>;
    template: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isSharedWithMentor: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    content: Record<string, any>;
    template: string;
    isSharedWithMentor: boolean;
}, {
    content: Record<string, any>;
    template?: string | undefined;
    isSharedWithMentor?: boolean | undefined;
}>;
export declare const createJobApplicationSchema: z.ZodObject<{
    position: z.ZodString;
    organization: z.ZodString;
    type: z.ZodString;
    deadline: z.ZodOptional<z.ZodDate>;
    applicationUrl: z.ZodOptional<z.ZodString>;
    coverLetter: z.ZodOptional<z.ZodString>;
    cvId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: string;
    position: string;
    organization: string;
    deadline?: Date | undefined;
    applicationUrl?: string | undefined;
    cvId?: string | undefined;
    coverLetter?: string | undefined;
}, {
    type: string;
    position: string;
    organization: string;
    deadline?: Date | undefined;
    applicationUrl?: string | undefined;
    cvId?: string | undefined;
    coverLetter?: string | undefined;
}>;
export declare const updateApplicationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["DRAFT", "SUBMITTED", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"]>;
    submittedAt: z.ZodOptional<z.ZodDate>;
    response: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "DRAFT" | "SUBMITTED" | "REVIEWING" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
    notes?: string | undefined;
    submittedAt?: Date | undefined;
    response?: string | undefined;
}, {
    status: "DRAFT" | "SUBMITTED" | "REVIEWING" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
    notes?: string | undefined;
    submittedAt?: Date | undefined;
    response?: string | undefined;
}>;
export type CreateCVInput = z.infer<typeof createCVSchema>;
export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
//# sourceMappingURL=career.validator.d.ts.map