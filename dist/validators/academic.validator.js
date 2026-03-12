"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manualEntrySchema = exports.uploadAcademicReportSchema = void 0;
const zod_1 = require("zod");
exports.uploadAcademicReportSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    term: zod_1.z.string().min(1),
    year: zod_1.z.number().int().min(2020).max(2030),
    fileUrl: zod_1.z.string().url(),
    fileName: zod_1.z.string().optional(),
    fileSize: zod_1.z.number().int().optional(),
    subjects: zod_1.z.record(zod_1.z.any()).optional(),
    overallGrade: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
});
exports.manualEntrySchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid(),
    term: zod_1.z.string().min(1),
    year: zod_1.z.number().int().min(2020).max(2030),
    subjects: zod_1.z.record(zod_1.z.any()),
    overallGrade: zod_1.z.string(),
    remarks: zod_1.z.string().optional(),
});
//# sourceMappingURL=academic.validator.js.map