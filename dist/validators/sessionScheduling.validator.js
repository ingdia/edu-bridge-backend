"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeeklyLabSessionsSchema = exports.getUpcomingSessionsSchema = exports.completeSessionSchema = exports.cancelSessionSchema = exports.rescheduleSessionSchema = exports.createSessionSchema = void 0;
const zod_1 = require("zod");
exports.createSessionSchema = zod_1.z.object({
    body: zod_1.z.object({
        mentorId: zod_1.z.string().uuid('Invalid mentor ID'),
        studentId: zod_1.z.string().uuid('Invalid student ID'),
        scheduledFor: zod_1.z.string().datetime('Invalid date format'),
        duration: zod_1.z.number().positive('Duration must be positive').default(60),
        location: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional()
    })
});
exports.rescheduleSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        sessionId: zod_1.z.string().uuid('Invalid session ID')
    }),
    body: zod_1.z.object({
        newDateTime: zod_1.z.string().datetime('Invalid date format'),
        reason: zod_1.z.string().min(5, 'Reason must be at least 5 characters').optional()
    })
});
exports.cancelSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        sessionId: zod_1.z.string().uuid('Invalid session ID')
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string().min(5, 'Reason must be at least 5 characters').optional()
    })
});
exports.completeSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        sessionId: zod_1.z.string().uuid('Invalid session ID')
    }),
    body: zod_1.z.object({
        notes: zod_1.z.string().optional(),
        actionItems: zod_1.z.string().optional()
    })
});
exports.getUpcomingSessionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        mentorId: zod_1.z.string().uuid('Invalid mentor ID').optional(),
        studentId: zod_1.z.string().uuid('Invalid student ID').optional()
    })
});
exports.createWeeklyLabSessionsSchema = zod_1.z.object({
    body: zod_1.z.object({
        mentorId: zod_1.z.string().uuid('Invalid mentor ID'),
        studentIds: zod_1.z.array(zod_1.z.string().uuid()).min(1, 'At least one student is required'),
        dayOfWeek: zod_1.z.number().int().min(0).max(6).optional(),
        time: zod_1.z.string().datetime('Invalid date format'),
        location: zod_1.z.string().default('Computer Lab')
    })
});
//# sourceMappingURL=sessionScheduling.validator.js.map