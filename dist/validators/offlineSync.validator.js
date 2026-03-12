"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsSyncedSchema = exports.getUnsyncedDataSchema = exports.syncSubmissionsSchema = exports.syncProgressSchema = exports.getModulesForOfflineSchema = void 0;
const zod_1 = require("zod");
exports.getModulesForOfflineSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    })
});
exports.syncProgressSchema = zod_1.z.object({
    body: zod_1.z.object({
        progressData: zod_1.z.array(zod_1.z.object({
            studentId: zod_1.z.string().uuid('Invalid student ID'),
            moduleId: zod_1.z.string().uuid('Invalid module ID'),
            score: zod_1.z.number().min(0).max(100).optional(),
            feedback: zod_1.z.string().optional(),
            completedAt: zod_1.z.string().datetime().optional(),
            timeSpent: zod_1.z.number().positive().optional()
        })).min(1, 'At least one progress record is required')
    })
});
exports.syncSubmissionsSchema = zod_1.z.object({
    body: zod_1.z.object({
        submissions: zod_1.z.array(zod_1.z.object({
            studentId: zod_1.z.string().uuid('Invalid student ID'),
            moduleId: zod_1.z.string().uuid('Invalid module ID'),
            exerciseType: zod_1.z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']),
            submissionContent: zod_1.z.any(),
            submittedAt: zod_1.z.string().datetime()
        })).min(1, 'At least one submission is required')
    })
});
exports.getUnsyncedDataSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    })
});
exports.markAsSyncedSchema = zod_1.z.object({
    body: zod_1.z.object({
        progressIds: zod_1.z.array(zod_1.z.string().uuid()).default([]),
        submissionIds: zod_1.z.array(zod_1.z.string().uuid()).default([])
    })
});
//# sourceMappingURL=offlineSync.validator.js.map