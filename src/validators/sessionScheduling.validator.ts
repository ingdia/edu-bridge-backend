import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    mentorId: z.string().uuid('Invalid mentor ID'),
    studentId: z.string().uuid('Invalid student ID'),
    scheduledFor: z.string().datetime('Invalid date format'),
    duration: z.number().positive('Duration must be positive').default(60),
    location: z.string().optional(),
    notes: z.string().optional()
  })
});

export const rescheduleSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid('Invalid session ID')
  }),
  body: z.object({
    newDateTime: z.string().datetime('Invalid date format'),
    reason: z.string().min(5, 'Reason must be at least 5 characters').optional()
  })
});

export const cancelSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid('Invalid session ID')
  }),
  body: z.object({
    reason: z.string().min(5, 'Reason must be at least 5 characters').optional()
  })
});

export const completeSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().uuid('Invalid session ID')
  }),
  body: z.object({
    notes: z.string().optional(),
    actionItems: z.string().optional()
  })
});

export const getUpcomingSessionsSchema = z.object({
  query: z.object({
    mentorId: z.string().uuid('Invalid mentor ID').optional(),
    studentId: z.string().uuid('Invalid student ID').optional()
  })
});

export const createWeeklyLabSessionsSchema = z.object({
  body: z.object({
    mentorId: z.string().uuid('Invalid mentor ID'),
    studentIds: z.array(z.string().uuid()).min(1, 'At least one student is required'),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    time: z.string().datetime('Invalid date format'),
    location: z.string().default('Computer Lab')
  })
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>['body'];
