import { z } from 'zod';

export const createCVSchema = z.object({
  content: z.record(z.any()),
  template: z.string().optional().default('standard'),
  isSharedWithMentor: z.boolean().optional().default(true),
});

export const createJobApplicationSchema = z.object({
  position: z.string().min(1),
  organization: z.string().min(1),
  type: z.string().min(1),
  deadline: z.coerce.date().optional(),
  applicationUrl: z.string().url().optional(),
  coverLetter: z.string().optional(),
  cvId: z.string().uuid().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED']),
  submittedAt: z.coerce.date().optional(),
  response: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateCVInput = z.infer<typeof createCVSchema>;
export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
