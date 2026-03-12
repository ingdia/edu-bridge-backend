"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusSchema = exports.createJobApplicationSchema = exports.createCVSchema = void 0;
const zod_1 = require("zod");
exports.createCVSchema = zod_1.z.object({
    content: zod_1.z.record(zod_1.z.any()),
    template: zod_1.z.string().optional().default('standard'),
    isSharedWithMentor: zod_1.z.boolean().optional().default(true),
});
exports.createJobApplicationSchema = zod_1.z.object({
    position: zod_1.z.string().min(1),
    organization: zod_1.z.string().min(1),
    type: zod_1.z.string().min(1),
    deadline: zod_1.z.coerce.date().optional(),
    applicationUrl: zod_1.z.string().url().optional(),
    coverLetter: zod_1.z.string().optional(),
    cvId: zod_1.z.string().uuid().optional(),
});
exports.updateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['DRAFT', 'SUBMITTED', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED']),
    submittedAt: zod_1.z.coerce.date().optional(),
    response: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=career.validator.js.map