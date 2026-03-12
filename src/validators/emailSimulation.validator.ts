import { z } from 'zod';

export const sendEmailSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  }),
  body: z.object({
    to: z.string().email('Invalid recipient email'),
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    body: z.string().min(10, 'Email body must be at least 10 characters').max(5000, 'Email body too long'),
    cc: z.string().email().optional(),
    bcc: z.string().email().optional()
  })
});

export const getInboxSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  })
});

export const markAsReadSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    emailId: z.string().min(1, 'Email ID is required')
  })
});

export const getSentEmailsSchema = z.object({
  params: z.object({
    studentId: z.string().uuid('Invalid student ID')
  })
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>['body'];
