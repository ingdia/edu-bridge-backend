"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpportunitiesQuerySchema = exports.updateOpportunitySchema = exports.createOpportunitySchema = void 0;
const zod_1 = require("zod");
exports.createOpportunitySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        organization: zod_1.z.string().min(1, 'Organization is required'),
        type: zod_1.z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']),
        description: zod_1.z.string().min(1, 'Description is required'),
        minGrade: zod_1.z.string().optional(),
        requiredSkills: zod_1.z.array(zod_1.z.string()).optional(),
        gradeLevel: zod_1.z.array(zod_1.z.string()).optional(),
        location: zod_1.z.string().optional(),
        applicationUrl: zod_1.z.string().url().optional(),
        deadline: zod_1.z.string().datetime().optional(),
        contactEmail: zod_1.z.string().email().optional(),
    }),
});
exports.updateOpportunitySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        organization: zod_1.z.string().min(1).optional(),
        type: zod_1.z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']).optional(),
        description: zod_1.z.string().min(1).optional(),
        minGrade: zod_1.z.string().optional(),
        requiredSkills: zod_1.z.array(zod_1.z.string()).optional(),
        gradeLevel: zod_1.z.array(zod_1.z.string()).optional(),
        location: zod_1.z.string().optional(),
        applicationUrl: zod_1.z.string().url().optional(),
        deadline: zod_1.z.string().datetime().optional(),
        contactEmail: zod_1.z.string().email().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getOpportunitiesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        type: zod_1.z.enum(['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING']).optional(),
        gradeLevel: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
        page: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
//# sourceMappingURL=opportunity.validator.js.map