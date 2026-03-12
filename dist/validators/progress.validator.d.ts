import { z } from 'zod';
export declare const submitProgressSchema: z.ZodObject<{
    moduleId: z.ZodString;
    score: z.ZodOptional<z.ZodNumber>;
    timeSpent: z.ZodOptional<z.ZodNumber>;
    completedAt: z.ZodOptional<z.ZodDate>;
    feedback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    score?: number | undefined;
    feedback?: string | undefined;
    completedAt?: Date | undefined;
    timeSpent?: number | undefined;
}, {
    moduleId: string;
    score?: number | undefined;
    feedback?: string | undefined;
    completedAt?: Date | undefined;
    timeSpent?: number | undefined;
}>;
export type SubmitProgressInput = z.infer<typeof submitProgressSchema>;
export declare const getProgressQuerySchema: z.ZodObject<{
    moduleId: z.ZodOptional<z.ZodString>;
    isCompleted: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    moduleId?: string | undefined;
    isCompleted?: "true" | "false" | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}, {
    moduleId?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    isCompleted?: "true" | "false" | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}>;
export type GetProgressQuery = z.infer<typeof getProgressQuerySchema>;
export declare const mentorDashboardSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodOptional<z.ZodString>;
    isCompleted: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    sortBy: z.ZodDefault<z.ZodEnum<["score", "completedAt", "timeSpent", "updatedAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    sortBy: "updatedAt" | "score" | "completedAt" | "timeSpent";
    sortOrder: "asc" | "desc";
    studentId?: string | undefined;
    moduleId?: string | undefined;
    isCompleted?: "true" | "false" | undefined;
}, {
    studentId?: string | undefined;
    moduleId?: string | undefined;
    sortBy?: "updatedAt" | "score" | "completedAt" | "timeSpent" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    isCompleted?: "true" | "false" | undefined;
}>;
export type MentorDashboardFilters = z.infer<typeof mentorDashboardSchema>;
export declare const parseBooleanParam: (value: string | undefined) => boolean | undefined;
//# sourceMappingURL=progress.validator.d.ts.map