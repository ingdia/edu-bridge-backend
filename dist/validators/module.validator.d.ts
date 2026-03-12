import { z } from 'zod';
export declare const moduleParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type ModuleParams = z.infer<typeof moduleParamsSchema>;
export declare const createModuleSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodNativeEnum<{
        LISTENING: "LISTENING";
        SPEAKING: "SPEAKING";
        READING: "READING";
        WRITING: "WRITING";
        DIGITAL_LITERACY: "DIGITAL_LITERACY";
    }>;
    contentUrl: z.ZodString;
    difficulty: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    estimatedDuration: z.ZodOptional<z.ZodNumber>;
    orderIndex: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
    isActive: boolean;
    title: string;
    contentUrl: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    orderIndex: number;
    description?: string | undefined;
    estimatedDuration?: number | undefined;
}, {
    type: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
    title: string;
    contentUrl: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    isActive?: boolean | undefined;
    description?: string | undefined;
    estimatedDuration?: number | undefined;
    orderIndex?: number | undefined;
}>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export declare const updateModuleSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodNativeEnum<{
        LISTENING: "LISTENING";
        SPEAKING: "SPEAKING";
        READING: "READING";
        WRITING: "WRITING";
        DIGITAL_LITERACY: "DIGITAL_LITERACY";
    }>>;
    contentUrl: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
    estimatedDuration: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    orderIndex: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    type?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    isActive?: boolean | undefined;
    title?: string | undefined;
    description?: string | undefined;
    contentUrl?: string | undefined;
    difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
    estimatedDuration?: number | undefined;
    orderIndex?: number | undefined;
}, {
    type?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    isActive?: boolean | undefined;
    title?: string | undefined;
    description?: string | undefined;
    contentUrl?: string | undefined;
    difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
    estimatedDuration?: number | undefined;
    orderIndex?: number | undefined;
}>;
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;
export declare const listModulesQuerySchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodNativeEnum<{
        LISTENING: "LISTENING";
        SPEAKING: "SPEAKING";
        READING: "READING";
        WRITING: "WRITING";
        DIGITAL_LITERACY: "DIGITAL_LITERACY";
    }>>;
    difficulty: z.ZodOptional<z.ZodEnum<["beginner", "intermediate", "advanced"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    search: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<["title", "difficulty", "orderIndex", "createdAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sortBy: "createdAt" | "title" | "difficulty" | "orderIndex";
    sortOrder: "asc" | "desc";
    type?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    search?: string | undefined;
    isActive?: boolean | undefined;
    difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
}, {
    type?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    search?: string | undefined;
    isActive?: boolean | undefined;
    difficulty?: "beginner" | "intermediate" | "advanced" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    sortBy?: "createdAt" | "title" | "difficulty" | "orderIndex" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type ListModulesQuery = z.infer<typeof listModulesQuerySchema>;
//# sourceMappingURL=module.validator.d.ts.map