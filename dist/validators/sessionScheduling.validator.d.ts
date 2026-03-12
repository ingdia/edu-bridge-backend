import { z } from 'zod';
export declare const createSessionSchema: z.ZodObject<{
    body: z.ZodObject<{
        mentorId: z.ZodString;
        studentId: z.ZodString;
        scheduledFor: z.ZodString;
        duration: z.ZodDefault<z.ZodNumber>;
        location: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        mentorId: string;
        scheduledFor: string;
        duration: number;
        location?: string | undefined;
        notes?: string | undefined;
    }, {
        studentId: string;
        mentorId: string;
        scheduledFor: string;
        duration?: number | undefined;
        location?: string | undefined;
        notes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        mentorId: string;
        scheduledFor: string;
        duration: number;
        location?: string | undefined;
        notes?: string | undefined;
    };
}, {
    body: {
        studentId: string;
        mentorId: string;
        scheduledFor: string;
        duration?: number | undefined;
        location?: string | undefined;
        notes?: string | undefined;
    };
}>;
export declare const rescheduleSessionSchema: z.ZodObject<{
    params: z.ZodObject<{
        sessionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
    }, {
        sessionId: string;
    }>;
    body: z.ZodObject<{
        newDateTime: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        newDateTime: string;
        reason?: string | undefined;
    }, {
        newDateTime: string;
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        sessionId: string;
    };
    body: {
        newDateTime: string;
        reason?: string | undefined;
    };
}, {
    params: {
        sessionId: string;
    };
    body: {
        newDateTime: string;
        reason?: string | undefined;
    };
}>;
export declare const cancelSessionSchema: z.ZodObject<{
    params: z.ZodObject<{
        sessionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
    }, {
        sessionId: string;
    }>;
    body: z.ZodObject<{
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        reason?: string | undefined;
    }, {
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        sessionId: string;
    };
    body: {
        reason?: string | undefined;
    };
}, {
    params: {
        sessionId: string;
    };
    body: {
        reason?: string | undefined;
    };
}>;
export declare const completeSessionSchema: z.ZodObject<{
    params: z.ZodObject<{
        sessionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
    }, {
        sessionId: string;
    }>;
    body: z.ZodObject<{
        notes: z.ZodOptional<z.ZodString>;
        actionItems: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        notes?: string | undefined;
        actionItems?: string | undefined;
    }, {
        notes?: string | undefined;
        actionItems?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        sessionId: string;
    };
    body: {
        notes?: string | undefined;
        actionItems?: string | undefined;
    };
}, {
    params: {
        sessionId: string;
    };
    body: {
        notes?: string | undefined;
        actionItems?: string | undefined;
    };
}>;
export declare const getUpcomingSessionsSchema: z.ZodObject<{
    query: z.ZodObject<{
        mentorId: z.ZodOptional<z.ZodString>;
        studentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        studentId?: string | undefined;
        mentorId?: string | undefined;
    }, {
        studentId?: string | undefined;
        mentorId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        studentId?: string | undefined;
        mentorId?: string | undefined;
    };
}, {
    query: {
        studentId?: string | undefined;
        mentorId?: string | undefined;
    };
}>;
export declare const createWeeklyLabSessionsSchema: z.ZodObject<{
    body: z.ZodObject<{
        mentorId: z.ZodString;
        studentIds: z.ZodArray<z.ZodString, "many">;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
        time: z.ZodString;
        location: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mentorId: string;
        location: string;
        studentIds: string[];
        time: string;
        dayOfWeek?: number | undefined;
    }, {
        mentorId: string;
        studentIds: string[];
        time: string;
        location?: string | undefined;
        dayOfWeek?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        mentorId: string;
        location: string;
        studentIds: string[];
        time: string;
        dayOfWeek?: number | undefined;
    };
}, {
    body: {
        mentorId: string;
        studentIds: string[];
        time: string;
        location?: string | undefined;
        dayOfWeek?: number | undefined;
    };
}>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>['body'];
//# sourceMappingURL=sessionScheduling.validator.d.ts.map