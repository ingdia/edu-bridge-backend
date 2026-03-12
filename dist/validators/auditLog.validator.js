"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentLogsSchema = exports.getEntityLogsSchema = exports.getActionLogsSchema = exports.getUserLogsSchema = void 0;
const zod_1 = require("zod");
exports.getUserLogsSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid('Invalid user ID')
    }),
    query: zod_1.z.object({
        limit: zod_1.z.string().regex(/^\d+$/).optional()
    })
});
exports.getActionLogsSchema = zod_1.z.object({
    params: zod_1.z.object({
        action: zod_1.z.string().min(1, 'Action is required')
    }),
    query: zod_1.z.object({
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional()
    })
});
exports.getEntityLogsSchema = zod_1.z.object({
    params: zod_1.z.object({
        entityType: zod_1.z.string().min(1, 'Entity type is required'),
        entityId: zod_1.z.string().uuid('Invalid entity ID')
    })
});
exports.getRecentLogsSchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.string().regex(/^\d+$/).optional()
    })
});
//# sourceMappingURL=auditLog.validator.js.map