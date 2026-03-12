"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsReadSchema = exports.getMessagesQuerySchema = exports.sendMessageSchema = void 0;
// src/validators/message.validator.ts
const zod_1 = require("zod");
// ─────────────────────────────────────────────────────────────
// SEND MESSAGE SCHEMA (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────
exports.sendMessageSchema = zod_1.z.object({
    recipientUserId: zod_1.z.string().uuid('Invalid recipient user ID'),
    subject: zod_1.z.string().max(200).optional(),
    content: zod_1.z.string().min(1, 'Message content is required').max(5000, 'Message too long'),
    threadId: zod_1.z.string().uuid().optional(),
    replyTo: zod_1.z.string().uuid().optional(),
});
// ─────────────────────────────────────────────────────────────
// GET MESSAGES QUERY SCHEMA
// ─────────────────────────────────────────────────────────────
exports.getMessagesQuerySchema = zod_1.z.object({
    conversationWith: zod_1.z.string().uuid().optional(),
    isRead: zod_1.z.enum(['true', 'false']).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).optional(),
    page: zod_1.z.string().regex(/^\d+$/).optional(),
});
// ─────────────────────────────────────────────────────────────
// MARK AS READ SCHEMA
// ─────────────────────────────────────────────────────────────
exports.markAsReadSchema = zod_1.z.object({
    messageIds: zod_1.z.array(zod_1.z.string().uuid()).min(1, 'At least one message ID required'),
});
//# sourceMappingURL=message.validator.js.map