import { z } from 'zod';

export const bulkStudentSchema = z.object({
  email: z.string().email('Invalid email'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  nationalId: z.string().min(5, 'National ID is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  schoolName: z.string().optional(),
  guardianName: z.string().optional(),
  guardianContact: z.string().optional()
});

export const importStudentsSchema = z.object({
  body: z.object({
    students: z.array(bulkStudentSchema).min(1, 'At least one student is required')
  })
});

export const bulkGradeSchema = z.object({
  studentNationalId: z.string().min(5, 'National ID is required'),
  term: z.string().min(1, 'Term is required'),
  year: z.number().int().min(2020).max(2100),
  subjects: z.record(z.any()),
  overallGrade: z.string().min(1, 'Overall grade is required')
});

export const uploadGradesSchema = z.object({
  body: z.object({
    grades: z.array(bulkGradeSchema).min(1, 'At least one grade record is required')
  })
});

export const sendBulkNotificationsSchema = z.object({
  body: z.object({
    recipientIds: z.array(z.string().uuid()).min(1, 'At least one recipient is required'),
    type: z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    actionUrl: z.string().url().optional()
  })
});

export const assignMentorsSchema = z.object({
  body: z.object({
    assignments: z.array(
      z.object({
        studentId: z.string().uuid('Invalid student ID'),
        mentorId: z.string().uuid('Invalid mentor ID')
      })
    ).min(1, 'At least one assignment is required')
  })
});

export type BulkStudentInput = z.infer<typeof bulkStudentSchema>;
export type BulkGradeInput = z.infer<typeof bulkGradeSchema>;
