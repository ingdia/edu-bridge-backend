import { z } from 'zod';
export declare const scanReportSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        term: z.ZodString;
        year: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        term: string;
        year: string;
    }, {
        studentId: string;
        term: string;
        year: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        term: string;
        year: string;
    };
}, {
    body: {
        studentId: string;
        term: string;
        year: string;
    };
}>;
export declare const processReportSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        term: z.ZodString;
        year: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        term: string;
        year: string;
    }, {
        studentId: string;
        term: string;
        year: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        term: string;
        year: string;
    };
}, {
    body: {
        studentId: string;
        term: string;
        year: string;
    };
}>;
export declare const correctScannedDataSchema: z.ZodObject<{
    params: z.ZodObject<{
        recordId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        recordId: string;
    }, {
        recordId: string;
    }>;
    body: z.ZodObject<{
        grades: z.ZodOptional<z.ZodArray<z.ZodObject<{
            subject: z.ZodString;
            score: z.ZodNumber;
            maxScore: z.ZodNumber;
            grade: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            score: number;
            subject: string;
            maxScore: number;
            grade?: string | undefined;
        }, {
            score: number;
            subject: string;
            maxScore: number;
            grade?: string | undefined;
        }>, "many">>;
        overallGrade: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        overallGrade?: number | undefined;
        grades?: {
            score: number;
            subject: string;
            maxScore: number;
            grade?: string | undefined;
        }[] | undefined;
    }, {
        overallGrade?: number | undefined;
        grades?: {
            score: number;
            subject: string;
            maxScore: number;
            grade?: string | undefined;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        recordId: string;
    };
    body: {
        overallGrade?: number | undefined;
        grades?: {
            score: number;
            subject: string;
            maxScore: number;
            grade?: string | undefined;
        }[] | undefined;
    };
}, {
    params: {
        recordId: string;
    };
    body: {
        overallGrade?: number | undefined;
        grades?: {
            score: number;
            subject: string;
            maxScore: number;
            grade?: string | undefined;
        }[] | undefined;
    };
}>;
export declare const getStudentScannedReportsSchema: z.ZodObject<{
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
export declare const getLowConfidenceScansSchema: z.ZodObject<{
    query: z.ZodObject<{
        threshold: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        threshold?: string | undefined;
    }, {
        threshold?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        threshold?: string | undefined;
    };
}, {
    query: {
        threshold?: string | undefined;
    };
}>;
//# sourceMappingURL=academicReportScanning.validator.d.ts.map