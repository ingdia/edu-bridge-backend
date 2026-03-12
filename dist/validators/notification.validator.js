"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkNotificationSchema = exports.getNotificationsQuerySchema = exports.updateNotificationSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
exports.createNotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipientId: zod_1.z.string().uuid('Invalid recipient ID'),
        type: zod_1.z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']),
        title: zod_1.z.string().min(1, 'Title is required'),
        message: zod_1.z.string().min(1, 'Message is required'),
        actionUrl: zod_1.z.string().url().optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
        sendEmail: zod_1.z.boolean().optional(),
    }),
});
exports.updateNotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
    }),
});
exports.getNotificationsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        type: zod_1.z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']).optional(),
        status: zod_1.z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
exports.bulkNotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipientIds: zod_1.z.array(zod_1.z.string().uuid()).min(1, 'At least one recipient is required'),
        type: zod_1.z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']),
        title: zod_1.z.string().min(1, 'Title is required'),
        message: zod_1.z.string().min(1, 'Message is required'),
        actionUrl: zod_1.z.string().url().optional(),
        sendEmail: zod_1.z.boolean().optional(),
    }),
});
//# sourceMappingURL=notification.validator.js.map