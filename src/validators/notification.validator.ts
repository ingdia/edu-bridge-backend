import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    recipientId: z.string().uuid('Invalid recipient ID'),
    type: z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    actionUrl: z.string().url().optional(),
    metadata: z.record(z.any()).optional(),
    sendEmail: z.boolean().optional(),
  }),
});

export const updateNotificationSchema = z.object({
  body: z.object({
    status: z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
  }),
});

export const getNotificationsQuerySchema = z.object({
  query: z.object({
    type: z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']).optional(),
    status: z.enum(['UNREAD', 'READ', 'ARCHIVED']).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const bulkNotificationSchema = z.object({
  body: z.object({
    recipientIds: z.array(z.string().uuid()).min(1, 'At least one recipient is required'),
    type: z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    actionUrl: z.string().url().optional(),
    sendEmail: z.boolean().optional(),
  }),
});
