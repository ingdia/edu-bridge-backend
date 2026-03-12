"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowConfidenceScansSchema = exports.getStudentScannedReportsSchema = exports.correctScannedDataSchema = exports.processReportSchema = exports.scanReportSchema = void 0;
const zod_1 = require("zod");
exports.scanReportSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID'),
        term: zod_1.z.string().min(1, 'Term is required'),
        year: zod_1.z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number')
    })
});
exports.processReportSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID'),
        term: zod_1.z.string().min(1, 'Term is required'),
        year: zod_1.z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number')
    })
});
exports.correctScannedDataSchema = zod_1.z.object({
    params: zod_1.z.object({
        recordId: zod_1.z.string().uuid('Invalid record ID')
    }),
    body: zod_1.z.object({
        grades: zod_1.z.array(zod_1.z.object({
            subject: zod_1.z.string().min(1, 'Subject is required'),
            score: zod_1.z.number().min(0, 'Score cannot be negative'),
            maxScore: zod_1.z.number().positive('Max score must be positive'),
            grade: zod_1.z.string().optional()
        })).optional(),
        overallGrade: zod_1.z.number().min(0).max(100).optional()
    })
});
exports.getStudentScannedReportsSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    })
});
exports.getLowConfidenceScansSchema = zod_1.z.object({
    query: zod_1.z.object({
        threshold: zod_1.z.string().regex(/^0\.\d+$|^1\.0$/).optional()
    })
});
//# sourceMappingURL=academicReportScanning.validator.js.map