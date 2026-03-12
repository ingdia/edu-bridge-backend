import { z } from 'zod';
export declare const getModulesForOfflineSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
    };
}, {
    params: {
        studentId: string;
    };
}>;
export declare const syncProgressSchema: z.ZodObject<{
    body: z.ZodObject<{
        progressData: z.ZodArray<z.ZodObject<{
            studentId: z.ZodString;
            moduleId: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            feedback: z.ZodOptional<z.ZodString>;
            completedAt: z.ZodOptional<z.ZodString>;
            timeSpent: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            studentId: string;
            moduleId: string;
            score?: number | undefined;
            feedback?: string | undefined;
            completedAt?: string | undefined;
            timeSpent?: number | undefined;
        }, {
            studentId: string;
            moduleId: string;
            score?: number | undefined;
            feedback?: string | undefined;
            completedAt?: string | undefined;
            timeSpent?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        progressData: {
            studentId: string;
            moduleId: string;
            score?: number | undefined;
            feedback?: string | undefined;
            completedAt?: string | undefined;
            timeSpent?: number | undefined;
        }[];
    }, {
        progressData: {
            studentId: string;
            moduleId: string;
            score?: number | undefined;
            feedback?: string | undefined;
            completedAt?: string | undefined;
            timeSpent?: number | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        progressData: {
            studentId: string;
            moduleId: string;
            score?: number | undefined;
            feedback?: string | undefined;
            completedAt?: string | undefined;
            timeSpent?: number | undefined;
        }[];
    };
}, {
    body: {
        progressData: {
            studentId: string;
            moduleId: string;
            score?: number | undefined;
            feedback?: string | undefined;
            completedAt?: string | undefined;
            timeSpent?: number | undefined;
        }[];
    };
}>;
export declare const syncSubmissionsSchema: z.ZodObject<{
    body: z.ZodObject<{
        submissions: z.ZodArray<z.ZodObject<{
            studentId: z.ZodString;
            moduleId: z.ZodString;
            exerciseType: z.ZodEnum<["LISTENING", "SPEAKING", "READING", "WRITING", "DIGITAL_LITERACY"]>;
            submissionContent: z.ZodAny;
            submittedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            studentId: string;
            moduleId: string;
            submittedAt: string;
            exerciseType: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
            submissionContent?: any;
        }, {
            studentId: string;
            moduleId: string;
            submittedAt: string;
            exerciseType: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
            submissionContent?: any;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        submissions: {
            studentId: string;
            moduleId: string;
            submittedAt: string;
            exerciseType: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
            submissionContent?: any;
        }[];
    }, {
        submissions: {
            studentId: string;
            moduleId: string;
            submittedAt: string;
            exerciseType: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
            submissionContent?: any;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        submissions: {
            studentId: string;
            moduleId: string;
            submittedAt: string;
            exerciseType: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
            submissionContent?: any;
        }[];
    };
}, {
    body: {
        submissions: {
            studentId: string;
            moduleId: string;
            submittedAt: string;
            exerciseType: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
            submissionContent?: any;
        }[];
    };
}>;
export declare const getUnsyncedDataSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
    };
}, {
    params: {
        studentId: string;
    };
}>;
export declare const markAsSyncedSchema: z.ZodObject<{
    body: z.ZodObject<{
        progressIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        submissionIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        progressIds: string[];
        submissionIds: string[];
    }, {
        progressIds?: string[] | undefined;
        submissionIds?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        progressIds: string[];
        submissionIds: string[];
    };
}, {
    body: {
        progressIds?: string[] | undefined;
        submissionIds?: string[] | undefined;
    };
}>;
//# sourceMappingURL=offlineSync.validator.d.ts.map