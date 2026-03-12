import { z } from 'zod';

export const uploadAudioSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    moduleId: z.string().uuid('Invalid module ID'),
    exerciseType: z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']).optional(),
    duration: z.number().positive().optional(),
    transcript: z.string().optional()
  })
});

export const evaluateAudioSchema = z.object({
  params: z.object({
    submissionId: z.string().uuid('Invalid submission ID')
  }),
  body: z.object({
    score: z.number().min(0).max(100, 'Score must be between 0 and 100'),
    feedback: z.string().min(10, 'Feedback must be at least 10 characters').optional(),
    rubricScores: z.record(z.number()).optional()
  })
});

export const getAudioSubmissionsSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  }),
  query: z.object({
    exerciseType: z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']).optional()
  })
});

export type UploadAudioInput = z.infer<typeof uploadAudioSchema>['body'];
export type EvaluateAudioInput = z.infer<typeof evaluateAudioSchema>['body'];
