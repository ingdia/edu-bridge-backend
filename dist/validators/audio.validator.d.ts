import { z } from 'zod';
export declare const uploadAudioSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        moduleId: z.ZodString;
        exerciseType: z.ZodOptional<z.ZodEnum<["LISTENING", "SPEAKING", "READING", "WRITING", "DIGITAL_LITERACY"]>>;
        duration: z.ZodOptional<z.ZodNumber>;
        transcript: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        moduleId: string;
        duration?: number | undefined;
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
        transcript?: string | undefined;
    }, {
        studentId: string;
        moduleId: string;
        duration?: number | undefined;
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
        transcript?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        moduleId: string;
        duration?: number | undefined;
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
        transcript?: string | undefined;
    };
}, {
    body: {
        studentId: string;
        moduleId: string;
        duration?: number | undefined;
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
        transcript?: string | undefined;
    };
}>;
export declare const evaluateAudioSchema: z.ZodObject<{
    params: z.ZodObject<{
        submissionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        submissionId: string;
    }, {
        submissionId: string;
    }>;
    body: z.ZodObject<{
        score: z.ZodNumber;
        feedback: z.ZodOptional<z.ZodString>;
        rubricScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        score: number;
        feedback?: string | undefined;
        rubricScores?: Record<string, number> | undefined;
    }, {
        score: number;
        feedback?: string | undefined;
        rubricScores?: Record<string, number> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        submissionId: string;
    };
    body: {
        score: number;
        feedback?: string | undefined;
        rubricScores?: Record<string, number> | undefined;
    };
}, {
    params: {
        submissionId: string;
    };
    body: {
        score: number;
        feedback?: string | undefined;
        rubricScores?: Record<string, number> | undefined;
    };
}>;
export declare const getAudioSubmissionsSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
    query: z.ZodObject<{
        exerciseType: z.ZodOptional<z.ZodEnum<["LISTENING", "SPEAKING", "READING", "WRITING", "DIGITAL_LITERACY"]>>;
    }, "strip", z.ZodTypeAny, {
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    }, {
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
    };
    query: {
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    };
}, {
    params: {
        studentId: string;
    };
    query: {
        exerciseType?: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY" | undefined;
    };
}>;
export type UploadAudioInput = z.infer<typeof uploadAudioSchema>['body'];
export type EvaluateAudioInput = z.infer<typeof evaluateAudioSchema>['body'];
//# sourceMappingURL=audio.validator.d.ts.map