import { z } from 'zod';

// Schema for submitting progress on a module
export const submitProgressSchema = z.object({
  moduleId: z.string().uuid('Invalid module ID format'),
  score: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100')
    .optional(),
  timeSpent: z.number()
    .min(0, 'Time spent cannot be negative')
    .optional(), // in minutes
  completedAt: z.coerce.date().optional(),
  feedback: z.string().max(1000, 'Feedback too long').optional(), // @db.Text allows longer
});

export type SubmitProgressInput = z.infer<typeof submitProgressSchema>;

// Schema for querying progress (filters)
export const getProgressQuerySchema = z.object({
  moduleId: z.string().uuid().optional(),
  // Filter by completion status (computed from completedAt)
  isCompleted: z.enum(['true', 'false']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export type GetProgressQuery = z.infer<typeof getProgressQuerySchema>;

// Schema for mentor dashboard filters
export const mentorDashboardSchema = z.object({
  studentId: z.string().uuid().optional(),
  moduleId: z.string().uuid().optional(),
  isCompleted: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['score', 'completedAt', 'timeSpent', 'updatedAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type MentorDashboardFilters = z.infer<typeof mentorDashboardSchema>;

// Helper: Convert string boolean to actual boolean
export const parseBooleanParam = (value: string | undefined): boolean | undefined => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};