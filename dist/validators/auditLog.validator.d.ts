import { z } from 'zod';
export declare const getUserLogsSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
    }, {
        userId: string;
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
        userId: string;
    };
    query: {
        limit?: string | undefined;
    };
}, {
    params: {
        userId: string;
    };
    query: {
        limit?: string | undefined;
    };
}>;
export declare const getActionLogsSchema: z.ZodObject<{
    params: z.ZodObject<{
        action: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        action: string;
    }, {
        action: string;
    }>;
    query: z.ZodObject<{
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        action: string;
    };
    query: {
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    params: {
        action: string;
    };
    query: {
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
export declare const getEntityLogsSchema: z.ZodObject<{
    params: z.ZodObject<{
        entityType: z.ZodString;
        entityId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        entityType: string;
        entityId: string;
    }, {
        entityType: string;
        entityId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        entityType: string;
        entityId: string;
    };
}, {
    params: {
        entityType: string;
        entityId: string;
    };
}>;
export declare const getRecentLogsSchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit?: string | undefined;
    }, {
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit?: string | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
    };
}>;
//# sourceMappingURL=auditLog.validator.d.ts.map