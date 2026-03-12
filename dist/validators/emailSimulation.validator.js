"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSentEmailsSchema = exports.markAsReadSchema = exports.getInboxSchema = exports.sendEmailSchema = void 0;
const zod_1 = require("zod");
exports.sendEmailSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    }),
    body: zod_1.z.object({
        to: zod_1.z.string().email('Invalid recipient email'),
        subject: zod_1.z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
        body: zod_1.z.string().min(10, 'Email body must be at least 10 characters').max(5000, 'Email body too long'),
        cc: zod_1.z.string().email().optional(),
        bcc: zod_1.z.string().email().optional()
    })
});
exports.getInboxSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    })
});
exports.markAsReadSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID'),
        emailId: zod_1.z.string().min(1, 'Email ID is required')
    })
});
exports.getSentEmailsSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    })
});
//# sourceMappingURL=emailSimulation.validator.js.map