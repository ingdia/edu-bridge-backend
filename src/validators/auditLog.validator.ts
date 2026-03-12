import { z } from 'zod';

export const getUserLogsSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID')
  }),
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional()
  })
});

export const getActionLogsSchema = z.object({
  params: z.object({
    action: z.string().min(1, 'Action is required')
  }),
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  })
});

export const getEntityLogsSchema = z.object({
  params: z.object({
    entityType: z.string().min(1, 'Entity type is required'),
    entityId: z.string().uuid('Invalid entity ID')
  })
});

export const getRecentLogsSchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional()
  })
});
