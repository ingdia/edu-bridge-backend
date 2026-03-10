import { z } from 'zod';

export const uploadAcademicReportSchema = z.object({
  studentId: z.string().uuid(),
  term: z.string().min(1),
  year: z.number().int().min(2020).max(2030),
  fileUrl: z.string().url(),
  fileName: z.string().optional(),
  fileSize: z.number().int().optional(),
  subjects: z.record(z.any()).optional(),
  overallGrade: z.string().optional(),
  remarks: z.string().optional(),
});

export const manualEntrySchema = z.object({
  studentId: z.string().uuid(),
  term: z.string().min(1),
  year: z.number().int().min(2020).max(2030),
  subjects: z.record(z.any()),
  overallGrade: z.string(),
  remarks: z.string().optional(),
});

export type UploadAcademicReportInput = z.infer<typeof uploadAcademicReportSchema>;
export type ManualEntryInput = z.infer<typeof manualEntrySchema>;
