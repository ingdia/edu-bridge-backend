import { z } from 'zod';
export declare const exerciseSubmissionBaseSchema: z.ZodObject<{
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
}, {
    moduleId: string;
}>;
export declare const listeningSubmissionSchema: z.ZodObject<{
    exerciseType: z.ZodLiteral<"LISTENING">;
    responses: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        answer: z.ZodString;
        answeredAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }, {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }>, "many">;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "LISTENING";
    responses: {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }[];
}, {
    moduleId: string;
    exerciseType: "LISTENING";
    responses: {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }[];
}>;
export declare const speakingSubmissionSchema: z.ZodObject<{
    exerciseType: z.ZodLiteral<"SPEAKING">;
    transcript: z.ZodOptional<z.ZodString>;
    recordingDuration: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "SPEAKING";
    notes?: string | undefined;
    transcript?: string | undefined;
    recordingDuration?: number | undefined;
}, {
    moduleId: string;
    exerciseType: "SPEAKING";
    notes?: string | undefined;
    transcript?: string | undefined;
    recordingDuration?: number | undefined;
}>;
export declare const readingSubmissionSchema: z.ZodObject<{
    exerciseType: z.ZodLiteral<"READING">;
    responses: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        answer: z.ZodString;
        questionType: z.ZodEnum<["multiple_choice", "short_answer", "true_false"]>;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }, {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }>, "many">;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "READING";
    responses: {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }[];
}, {
    moduleId: string;
    exerciseType: "READING";
    responses: {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }[];
}>;
export declare const writingSubmissionSchema: z.ZodObject<{
    exerciseType: z.ZodLiteral<"WRITING">;
    content: z.ZodString;
    wordCount: z.ZodOptional<z.ZodNumber>;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "WRITING";
    content: string;
    wordCount?: number | undefined;
}, {
    moduleId: string;
    exerciseType: "WRITING";
    content: string;
    wordCount?: number | undefined;
}>;
export declare const digitalLiteracySubmissionSchema: z.ZodObject<{
    exerciseType: z.ZodLiteral<"DIGITAL_LITERACY">;
    completed: z.ZodBoolean;
    artifactUrl: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "DIGITAL_LITERACY";
    completed: boolean;
    notes?: string | undefined;
    artifactUrl?: string | undefined;
}, {
    moduleId: string;
    exerciseType: "DIGITAL_LITERACY";
    completed: boolean;
    notes?: string | undefined;
    artifactUrl?: string | undefined;
}>;
export declare const exerciseSubmissionSchema: z.ZodDiscriminatedUnion<"exerciseType", [z.ZodObject<{
    exerciseType: z.ZodLiteral<"LISTENING">;
    responses: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        answer: z.ZodString;
        answeredAt: z.ZodOptional<z.ZodDate>;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }, {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }>, "many">;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "LISTENING";
    responses: {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }[];
}, {
    moduleId: string;
    exerciseType: "LISTENING";
    responses: {
        questionId: string;
        answer: string;
        answeredAt?: Date | undefined;
    }[];
}>, z.ZodObject<{
    exerciseType: z.ZodLiteral<"SPEAKING">;
    transcript: z.ZodOptional<z.ZodString>;
    recordingDuration: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "SPEAKING";
    notes?: string | undefined;
    transcript?: string | undefined;
    recordingDuration?: number | undefined;
}, {
    moduleId: string;
    exerciseType: "SPEAKING";
    notes?: string | undefined;
    transcript?: string | undefined;
    recordingDuration?: number | undefined;
}>, z.ZodObject<{
    exerciseType: z.ZodLiteral<"READING">;
    responses: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        answer: z.ZodString;
        questionType: z.ZodEnum<["multiple_choice", "short_answer", "true_false"]>;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }, {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }>, "many">;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "READING";
    responses: {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }[];
}, {
    moduleId: string;
    exerciseType: "READING";
    responses: {
        questionId: string;
        answer: string;
        questionType: "multiple_choice" | "short_answer" | "true_false";
    }[];
}>, z.ZodObject<{
    exerciseType: z.ZodLiteral<"WRITING">;
    content: z.ZodString;
    wordCount: z.ZodOptional<z.ZodNumber>;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "WRITING";
    content: string;
    wordCount?: number | undefined;
}, {
    moduleId: string;
    exerciseType: "WRITING";
    content: string;
    wordCount?: number | undefined;
}>, z.ZodObject<{
    exerciseType: z.ZodLiteral<"DIGITAL_LITERACY">;
    completed: z.ZodBoolean;
    artifactUrl: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    moduleId: string;
    exerciseType: "DIGITAL_LITERACY";
    completed: boolean;
    notes?: string | undefined;
    artifactUrl?: string | undefined;
}, {
    moduleId: string;
    exerciseType: "DIGITAL_LITERACY";
    completed: boolean;
    notes?: string | undefined;
    artifactUrl?: string | undefined;
}>]>;
export type ExerciseSubmissionInput = z.infer<typeof exerciseSubmissionSchema>;
export declare const getSubmissionsQuerySchema: z.ZodObject<{
    moduleId: z.ZodOptional<z.ZodString>;
    exerciseType: z.ZodOptional<z.ZodNativeEnum<{
        LISTENING: "LISTENING";
        SPEAKING: "SPEAKING";
        READING: "READING";
        WRITING: "WRITING";
        DIGITAL_LITERACY: "DIGITAL_LITERACY";
    }>>;
    studentId: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["pending", "evaluated", "all"]>>;
    sortBy: z.ZodDefault<z.ZodEnum<["submittedAt", "score", "updatedAt"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    limit: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "all" | "pending" | "evaluated";
    limit: number;
    page: number;
    sortBy: "updatedAt" | "score" | "submittedAt";
    sortOrder: "asc" | "desc";
    studentId?: string | undefined;
    moduleId?: string | undefined;
    exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
}, {
    status?: "all" | "pending" | "evaluated" | undefined;
    studentId?: string | undefined;
    moduleId?: string | undefined;
    exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    sortBy?: "updatedAt" | "score" | "submittedAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type GetSubmissionsQuery = z.infer<typeof getSubmissionsQuerySchema>;
export declare const evaluateSubmissionSchema: z.ZodObject<{
    score: z.ZodOptional<z.ZodNumber>;
    feedback: z.ZodOptional<z.ZodString>;
    rubricScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    isPassed: z.ZodOptional<z.ZodBoolean>;
    evaluatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    score?: number | undefined;
    feedback?: string | undefined;
    rubricScores?: Record<string, number> | undefined;
    isPassed?: boolean | undefined;
    evaluatedAt?: Date | undefined;
}, {
    score?: number | undefined;
    feedback?: string | undefined;
    rubricScores?: Record<string, number> | undefined;
    isPassed?: boolean | undefined;
    evaluatedAt?: Date | undefined;
}>;
export type EvaluateSubmissionInput = z.infer<typeof evaluateSubmissionSchema>;
//# sourceMappingURL=exercise.validator.d.ts.map