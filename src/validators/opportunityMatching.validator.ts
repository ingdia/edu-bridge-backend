import { z } from 'zod';

export const getMatchedOpportunitiesSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  }),
  query: z.object({
    type: z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']).optional(),
    minScore: z.string().regex(/^\d+(\.\d+)?$/).optional()
  })
});

export const getTopPerformersSchema = z.object({
  params: z.object({
    opportunityId: z.string().uuid('Invalid opportunity ID')
  }),
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional()
  })
});

export const calculateMatchScoreSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    opportunityId: z.string().uuid('Invalid opportunity ID')
  })
});
