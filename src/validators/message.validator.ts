// src/validators/message.validator.ts
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// SEND MESSAGE SCHEMA (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────

export const sendMessageSchema = z.object({
  recipientUserId: z.string().uuid('Invalid recipient user ID'),
  subject: z.string().max(200).optional(),
  content: z.string().min(1, 'Message content is required').max(5000, 'Message too long'),
  threadId: z.string().uuid().optional(),
  replyTo: z.string().uuid().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// ─────────────────────────────────────────────────────────────
// GET MESSAGES QUERY SCHEMA
// ─────────────────────────────────────────────────────────────

export const getMessagesQuerySchema = z.object({
  conversationWith: z.string().uuid().optional(),
  isRead: z.enum(['true', 'false']).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  page: z.string().regex(/^\d+$/).optional(),
});

export type GetMessagesQuery = z.infer<typeof getMessagesQuerySchema>;

// ─────────────────────────────────────────────────────────────
// MARK AS READ SCHEMA
// ─────────────────────────────────────────────────────────────

export const markAsReadSchema = z.object({
  messageIds: z.array(z.string().uuid()).min(1, 'At least one message ID required'),
});

export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
