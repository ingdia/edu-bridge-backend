import { z } from 'zod';
export declare const sendMessageSchema: z.ZodObject<{
    recipientUserId: z.ZodString;
    subject: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    threadId: z.ZodOptional<z.ZodString>;
    replyTo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    content: string;
    recipientUserId: string;
    replyTo?: string | undefined;
    subject?: string | undefined;
    threadId?: string | undefined;
}, {
    content: string;
    recipientUserId: string;
    replyTo?: string | undefined;
    subject?: string | undefined;
    threadId?: string | undefined;
}>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export declare const getMessagesQuerySchema: z.ZodObject<{
    conversationWith: z.ZodOptional<z.ZodString>;
    isRead: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    limit: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: string | undefined;
    page?: string | undefined;
    conversationWith?: string | undefined;
    isRead?: "true" | "false" | undefined;
}, {
    limit?: string | undefined;
    page?: string | undefined;
    conversationWith?: string | undefined;
    isRead?: "true" | "false" | undefined;
}>;
export type GetMessagesQuery = z.infer<typeof getMessagesQuerySchema>;
export declare const markAsReadSchema: z.ZodObject<{
    messageIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    messageIds: string[];
}, {
    messageIds: string[];
}>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
//# sourceMappingURL=message.validator.d.ts.map