import { z } from 'zod';

export const scanReportSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    term: z.string().min(1, 'Term is required'),
    year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number')
  })
});

export const processReportSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    term: z.string().min(1, 'Term is required'),
    year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number')
  })
});

export const correctScannedDataSchema = z.object({
  params: z.object({
    recordId: z.string().uuid('Invalid record ID')
  }),
  body: z.object({
    grades: z.array(
      z.object({
        subject: z.string().min(1, 'Subject is required'),
        score: z.number().min(0, 'Score cannot be negative'),
        maxScore: z.number().positive('Max score must be positive'),
        grade: z.string().optional()
      })
    ).optional(),
    overallGrade: z.number().min(0).max(100).optional()
  })
});

export const getStudentScannedReportsSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  })
});

export const getLowConfidenceScansSchema = z.object({
  query: z.object({
    threshold: z.string().regex(/^0\.\d+$|^1\.0$/).optional()
  })
});
