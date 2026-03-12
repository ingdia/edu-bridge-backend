import { z } from 'zod';
export declare const createSessionSchema: z.ZodObject<{
    studentId: z.ZodString;
    scheduledFor: z.ZodDate;
    duration: z.ZodDefault<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    studentId: string;
    scheduledFor: Date;
    duration: number;
    location?: string | undefined;
    notes?: string | undefined;
}, {
    studentId: string;
    scheduledFor: Date;
    duration?: number | undefined;
    location?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateSessionSchema: z.ZodObject<{
    status: z.ZodEnum<["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]>;
    notes: z.ZodOptional<z.ZodString>;
    actionItems: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    notes?: string | undefined;
    actionItems?: string | undefined;
}, {
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    notes?: string | undefined;
    actionItems?: string | undefined;
}>;
export declare const rescheduleSessionSchema: z.ZodObject<{
    scheduledFor: z.ZodDate;
    duration: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    scheduledFor: Date;
    duration?: number | undefined;
    location?: string | undefined;
    notes?: string | undefined;
}, {
    scheduledFor: Date;
    duration?: number | undefined;
    location?: string | undefined;
    notes?: string | undefined;
}>;
export declare const cancelSessionSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export declare const getSessionsQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]>>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    studentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | undefined;
    studentId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}, {
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | undefined;
    studentId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}>;
export declare const sendMessageSchema: z.ZodObject<{
    recipientId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    recipientId: string;
    content: string;
}, {
    recipientId: string;
    content: string;
}>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type RescheduleSessionInput = z.infer<typeof rescheduleSessionSchema>;
export type CancelSessionInput = z.infer<typeof cancelSessionSchema>;
export type GetSessionsQuery = z.infer<typeof getSessionsQuerySchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
//# sourceMappingURL=mentorship.validator.d.ts.map