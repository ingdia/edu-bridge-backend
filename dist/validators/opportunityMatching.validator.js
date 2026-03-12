"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchScoreSchema = exports.getTopPerformersSchema = exports.getMatchedOpportunitiesSchema = void 0;
const zod_1 = require("zod");
exports.getMatchedOpportunitiesSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    }),
    query: zod_1.z.object({
        type: zod_1.z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']).optional(),
        minScore: zod_1.z.string().regex(/^\d+(\.\d+)?$/).optional()
    })
});
exports.getTopPerformersSchema = zod_1.z.object({
    params: zod_1.z.object({
        opportunityId: zod_1.z.string().uuid('Invalid opportunity ID')
    }),
    query: zod_1.z.object({
        limit: zod_1.z.string().regex(/^\d+$/).optional()
    })
});
exports.calculateMatchScoreSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID'),
        opportunityId: zod_1.z.string().uuid('Invalid opportunity ID')
    })
});
//# sourceMappingURL=opportunityMatching.validator.js.map