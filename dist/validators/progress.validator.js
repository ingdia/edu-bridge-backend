"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBooleanParam = exports.mentorDashboardSchema = exports.getProgressQuerySchema = exports.submitProgressSchema = void 0;
const zod_1 = require("zod");
// Schema for submitting progress on a module
exports.submitProgressSchema = zod_1.z.object({
    moduleId: zod_1.z.string().uuid('Invalid module ID format'),
    score: zod_1.z.number()
        .min(0, 'Score cannot be negative')
        .max(100, 'Score cannot exceed 100')
        .optional(),
    timeSpent: zod_1.z.number()
        .min(0, 'Time spent cannot be negative')
        .optional(), // in minutes
    completedAt: zod_1.z.coerce.date().optional(),
    feedback: zod_1.z.string().max(1000, 'Feedback too long').optional(), // @db.Text allows longer
});
// Schema for querying progress (filters)
exports.getProgressQuerySchema = zod_1.z.object({
    moduleId: zod_1.z.string().uuid().optional(),
    // Filter by completion status (computed from completedAt)
    isCompleted: zod_1.z.enum(['true', 'false']).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    page: zod_1.z.coerce.number().min(1).default(1),
});
// Schema for mentor dashboard filters
exports.mentorDashboardSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid().optional(),
    moduleId: zod_1.z.string().uuid().optional(),
    isCompleted: zod_1.z.enum(['true', 'false']).optional(),
    sortBy: zod_1.z.enum(['score', 'completedAt', 'timeSpent', 'updatedAt']).default('updatedAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
// Helper: Convert string boolean to actual boolean
const parseBooleanParam = (value) => {
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    return undefined;
};
exports.parseBooleanParam = parseBooleanParam;
//# sourceMappingURL=progress.validator.js.map