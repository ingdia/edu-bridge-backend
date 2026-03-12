import { z } from 'zod';

export const getModulesForOfflineSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  })
});

export const syncProgressSchema = z.object({
  body: z.object({
    progressData: z.array(
      z.object({
        studentId: z.string().uuid('Invalid student ID'),
        moduleId: z.string().uuid('Invalid module ID'),
        score: z.number().min(0).max(100).optional(),
        feedback: z.string().optional(),
        completedAt: z.string().datetime().optional(),
        timeSpent: z.number().positive().optional()
      })
    ).min(1, 'At least one progress record is required')
  })
});

export const syncSubmissionsSchema = z.object({
  body: z.object({
    submissions: z.array(
      z.object({
        studentId: z.string().uuid('Invalid student ID'),
        moduleId: z.string().uuid('Invalid module ID'),
        exerciseType: z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']),
        submissionContent: z.any(),
        submittedAt: z.string().datetime()
      })
    ).min(1, 'At least one submission is required')
  })
});

export const getUnsyncedDataSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  })
});

export const markAsSyncedSchema = z.object({
  body: z.object({
    progressIds: z.array(z.string().uuid()).default([]),
    submissionIds: z.array(z.string().uuid()).default([])
  })
});
