import { z } from 'zod';

export const createOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().min(1, 'Organization is required'),
    type: z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']),
    description: z.string().min(1, 'Description is required'),
    minGrade: z.string().optional(),
    requiredSkills: z.array(z.string()).optional(),
    gradeLevel: z.array(z.string()).optional(),
    location: z.string().optional(),
    applicationUrl: z.string().url().optional(),
    deadline: z.string().datetime().optional(),
    contactEmail: z.string().email().optional(),
  }),
});

export const updateOpportunitySchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    organization: z.string().min(1).optional(),
    type: z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']).optional(),
    description: z.string().min(1).optional(),
    minGrade: z.string().optional(),
    requiredSkills: z.array(z.string()).optional(),
    gradeLevel: z.array(z.string()).optional(),
    location: z.string().optional(),
    applicationUrl: z.string().url().optional(),
    deadline: z.string().datetime().optional(),
    contactEmail: z.string().email().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getOpportunitiesQuerySchema = z.object({
  query: z.object({
    type: z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']).optional(),
    gradeLevel: z.string().optional(),
    location: z.string().optional(),
    isActive: z.enum(['true', 'false']).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    page: z.string().regex(/^\d+$/).optional(),
  }),
});
