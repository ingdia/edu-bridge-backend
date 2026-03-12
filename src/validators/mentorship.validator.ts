import { z } from 'zod';

export const createSessionSchema = z.object({
  studentId: z.string().uuid(),
  scheduledFor: z.coerce.date(),
  duration: z.number().int().min(30).max(180).default(60),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const updateSessionSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
  notes: z.string().optional(),
  actionItems: z.string().optional(),
});

export const rescheduleSessionSchema = z.object({
  scheduledFor: z.coerce.date(),
  duration: z.number().int().min(30).max(180).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const cancelSessionSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required'),
});

export const getSessionsQuerySchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  studentId: z.string().uuid().optional(),
});

export const sendMessageSchema = z.object({
  recipientId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type RescheduleSessionInput = z.infer<typeof rescheduleSessionSchema>;
export type CancelSessionInput = z.infer<typeof cancelSessionSchema>;
export type GetSessionsQuery = z.infer<typeof getSessionsQuerySchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
