import { z } from 'zod';

export const startLessonSchema = z.object({
  body: z.object({
    lessonTitle: z.string().min(1, 'Lesson title is required'),
    lessonType: z.enum(['email', 'computer_basics', 'internet_safety', 'digital_communication']),
  }),
});

export const completeLessonSchema = z.object({
  body: z.object({
    lessonTitle: z.string().min(1, 'Lesson title is required'),
    lessonType: z.enum(['email', 'computer_basics', 'internet_safety', 'digital_communication']),
    score: z.number().min(0).max(100).optional(),
    practiceData: z.record(z.any()).optional(),
  }),
});

export const getLessonsQuerySchema = z.object({
  query: z.object({
    lessonType: z.enum(['email', 'computer_basics', 'internet_safety', 'digital_communication']).optional(),
    completed: z.enum(['true', 'false']).optional(),
  }),
});
