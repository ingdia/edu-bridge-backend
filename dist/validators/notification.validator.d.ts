import { z } from 'zod';
export declare const createNotificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        recipientId: z.ZodString;
        type: z.ZodEnum<["SESSION_REMINDER", "DEADLINE_ALERT", "FEEDBACK_RECEIVED", "APPLICATION_UPDATE", "SYSTEM_ANNOUNCEMENT"]>;
        title: z.ZodString;
        message: z.ZodString;
        actionUrl: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        sendEmail: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        recipientId: string;
        title: string;
        actionUrl?: string | undefined;
        metadata?: Record<string, any> | undefined;
        sendEmail?: boolean | undefined;
    }, {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        recipientId: string;
        title: string;
        actionUrl?: string | undefined;
        metadata?: Record<string, any> | undefined;
        sendEmail?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        recipientId: string;
        title: string;
        actionUrl?: string | undefined;
        metadata?: Record<string, any> | undefined;
        sendEmail?: boolean | undefined;
    };
}, {
    body: {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        recipientId: string;
        title: string;
        actionUrl?: string | undefined;
        metadata?: Record<string, any> | undefined;
        sendEmail?: boolean | undefined;
    };
}>;
export declare const updateNotificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["UNREAD", "READ", "ARCHIVED"]>>;
    }, "strip", z.ZodTypeAny, {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
    }, {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
    };
}, {
    body: {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
    };
}>;
export declare const getNotificationsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<["SESSION_REMINDER", "DEADLINE_ALERT", "FEEDBACK_RECEIVED", "APPLICATION_UPDATE", "SYSTEM_ANNOUNCEMENT"]>>;
        status: z.ZodOptional<z.ZodEnum<["UNREAD", "READ", "ARCHIVED"]>>;
        limit: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
        type?: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT" | undefined;
        limit?: string | undefined;
    }, {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
        type?: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT" | undefined;
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
        type?: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT" | undefined;
        limit?: string | undefined;
    };
}, {
    query: {
        status?: "UNREAD" | "READ" | "ARCHIVED" | undefined;
        type?: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT" | undefined;
        limit?: string | undefined;
    };
}>;
export declare const bulkNotificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        recipientIds: z.ZodArray<z.ZodString, "many">;
        type: z.ZodEnum<["SESSION_REMINDER", "DEADLINE_ALERT", "FEEDBACK_RECEIVED", "APPLICATION_UPDATE", "SYSTEM_ANNOUNCEMENT"]>;
        title: z.ZodString;
        message: z.ZodString;
        actionUrl: z.ZodOptional<z.ZodString>;
        sendEmail: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
        sendEmail?: boolean | undefined;
    }, {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
        sendEmail?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
        sendEmail?: boolean | undefined;
    };
}, {
    body: {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
        sendEmail?: boolean | undefined;
    };
}>;
//# sourceMappingURL=notification.validator.d.ts.map