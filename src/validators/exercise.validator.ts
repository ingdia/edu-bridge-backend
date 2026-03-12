import { z } from 'zod';

// Define ExerciseType enum locally
const ExerciseType = {
  LISTENING: 'LISTENING',
  SPEAKING: 'SPEAKING',
  READING: 'READING',
  WRITING: 'WRITING',
  DIGITAL_LITERACY: 'DIGITAL_LITERACY',
} as const;

type ExerciseTypeValue = typeof ExerciseType[keyof typeof ExerciseType];

// Base schema
export const exerciseSubmissionBaseSchema = z.object({
  moduleId: z.string().uuid('Invalid module ID'),
});

// Type-specific schemas
export const listeningSubmissionSchema = z.object({
  ...exerciseSubmissionBaseSchema.shape,
  exerciseType: z.literal(ExerciseType.LISTENING),
  responses: z.array(
    z.object({
      questionId: z.string().uuid(),
      answer: z.string().max(500),
      answeredAt: z.coerce.date().optional(),
    })
  ).min(1, 'At least one response required'),
});

export const speakingSubmissionSchema = z.object({
  ...exerciseSubmissionBaseSchema.shape,
  exerciseType: z.literal(ExerciseType.SPEAKING),
  transcript: z.string().max(2000).optional(),
  recordingDuration: z.number().min(1).max(600).optional(),
  notes: z.string().max(500).optional(),
});

export const readingSubmissionSchema = z.object({
  ...exerciseSubmissionBaseSchema.shape,
  exerciseType: z.literal(ExerciseType.READING),
  responses: z.array(
    z.object({
      questionId: z.string().uuid(),
      answer: z.string().max(1000),
      questionType: z.enum(['multiple_choice', 'short_answer', 'true_false']),
    })
  ).min(1, 'At least one response required'),
});

export const writingSubmissionSchema = z.object({
  ...exerciseSubmissionBaseSchema.shape,
  exerciseType: z.literal(ExerciseType.WRITING),
  content: z.string().min(50, 'Submission too short').max(5000, 'Submission too long'),
  wordCount: z.number().min(10).optional(),
});

export const digitalLiteracySubmissionSchema = z.object({
  ...exerciseSubmissionBaseSchema.shape,
  exerciseType: z.literal(ExerciseType.DIGITAL_LITERACY),
  completed: z.boolean(),
  artifactUrl: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

// Discriminated union for polymorphic validation
export const exerciseSubmissionSchema = z.discriminatedUnion('exerciseType', [
  listeningSubmissionSchema,
  speakingSubmissionSchema,
  readingSubmissionSchema,
  writingSubmissionSchema,
  digitalLiteracySubmissionSchema,
]);

export type ExerciseSubmissionInput = z.infer<typeof exerciseSubmissionSchema>;

// Query filters
export const getSubmissionsQuerySchema = z.object({
  moduleId: z.string().uuid().optional(),
  exerciseType: z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']).optional(),
  studentId: z.string().uuid().optional(),
  status: z.enum(['pending', 'evaluated', 'all']).default('all'),
  sortBy: z.enum(['submittedAt', 'score', 'updatedAt']).default('submittedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export type GetSubmissionsQuery = z.infer<typeof getSubmissionsQuerySchema>;

// Mentor evaluation schema
export const evaluateSubmissionSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  feedback: z.string().max(2000, 'Feedback too long').optional(),
  rubricScores: z.record(z.string(), z.number().min(0).max(10)).optional(),
  isPassed: z.boolean().optional(),
  evaluatedAt: z.coerce.date().optional(),
});

export type EvaluateSubmissionInput = z.infer<typeof evaluateSubmissionSchema>;