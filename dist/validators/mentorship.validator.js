"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = exports.getSessionsQuerySchema = exports.cancelSessionSchema = exports.rescheduleSessionSchema = exports.updateSessionSchema = exports.createSessionSchema = void 0;
const zod_1 = require("zod");
exports.createSessionSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    scheduledFor: zod_1.z.coerce.date(),
    duration: zod_1.z.number().int().min(30).max(180).default(60),
    location: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateSessionSchema = zod_1.z.object({
    status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
    notes: zod_1.z.string().optional(),
    actionItems: zod_1.z.string().optional(),
});
exports.rescheduleSessionSchema = zod_1.z.object({
    scheduledFor: zod_1.z.coerce.date(),
    duration: zod_1.z.number().int().min(30).max(180).optional(),
    location: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.cancelSessionSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1, 'Cancellation reason is required'),
});
exports.getSessionsQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    studentId: zod_1.z.string().uuid().optional(),
});
exports.sendMessageSchema = zod_1.z.object({
    recipientId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(2000),
});
//# sourceMappingURL=mentorship.validator.js.map