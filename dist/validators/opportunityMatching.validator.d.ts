import { z } from 'zod';
export declare const getMatchedOpportunitiesSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
    query: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<["JOB", "INTERNSHIP", "SCHOLARSHIP", "UNIVERSITY", "TRAINING"]>>;
        minScore: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        minScore?: string | undefined;
    }, {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        minScore?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
    };
    query: {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        minScore?: string | undefined;
    };
}, {
    params: {
        studentId: string;
    };
    query: {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        minScore?: string | undefined;
    };
}>;
export declare const getTopPerformersSchema: z.ZodObject<{
    params: z.ZodObject<{
        opportunityId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        opportunityId: string;
    }, {
        opportunityId: string;
    }>;
    query: z.ZodObject<{
        limit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit?: string | undefined;
    }, {
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        opportunityId: string;
    };
    query: {
        limit?: string | undefined;
    };
}, {
    params: {
        opportunityId: string;
    };
    query: {
        limit?: string | undefined;
    };
}>;
export declare const calculateMatchScoreSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
        opportunityId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        opportunityId: string;
    }, {
        studentId: string;
        opportunityId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
        opportunityId: string;
    };
}, {
    params: {
        studentId: string;
        opportunityId: string;
    };
}>;
//# sourceMappingURL=opportunityMatching.validator.d.ts.map