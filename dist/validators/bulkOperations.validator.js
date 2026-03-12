"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignMentorsSchema = exports.sendBulkNotificationsSchema = exports.uploadGradesSchema = exports.bulkGradeSchema = exports.importStudentsSchema = exports.bulkStudentSchema = void 0;
const zod_1 = require("zod");
exports.bulkStudentSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters'),
    dateOfBirth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    nationalId: zod_1.z.string().min(5, 'National ID is required'),
    gradeLevel: zod_1.z.string().min(1, 'Grade level is required'),
    schoolName: zod_1.z.string().optional(),
    guardianName: zod_1.z.string().optional(),
    guardianContact: zod_1.z.string().optional()
});
exports.importStudentsSchema = zod_1.z.object({
    body: zod_1.z.object({
        students: zod_1.z.array(exports.bulkStudentSchema).min(1, 'At least one student is required')
    })
});
exports.bulkGradeSchema = zod_1.z.object({
    studentNationalId: zod_1.z.string().min(5, 'National ID is required'),
    term: zod_1.z.string().min(1, 'Term is required'),
    year: zod_1.z.number().int().min(2020).max(2100),
    subjects: zod_1.z.record(zod_1.z.any()),
    overallGrade: zod_1.z.string().min(1, 'Overall grade is required')
});
exports.uploadGradesSchema = zod_1.z.object({
    body: zod_1.z.object({
        grades: zod_1.z.array(exports.bulkGradeSchema).min(1, 'At least one grade record is required')
    })
});
exports.sendBulkNotificationsSchema = zod_1.z.object({
    body: zod_1.z.object({
        recipientIds: zod_1.z.array(zod_1.z.string().uuid()).min(1, 'At least one recipient is required'),
        type: zod_1.z.enum(['SESSION_REMINDER', 'DEADLINE_ALERT', 'FEEDBACK_RECEIVED', 'APPLICATION_UPDATE', 'SYSTEM_ANNOUNCEMENT']),
        title: zod_1.z.string().min(1, 'Title is required'),
        message: zod_1.z.string().min(10, 'Message must be at least 10 characters'),
        actionUrl: zod_1.z.string().url().optional()
    })
});
exports.assignMentorsSchema = zod_1.z.object({
    body: zod_1.z.object({
        assignments: zod_1.z.array(zod_1.z.object({
            studentId: zod_1.z.string().uuid('Invalid student ID'),
            mentorId: zod_1.z.string().uuid('Invalid mentor ID')
        })).min(1, 'At least one assignment is required')
    })
});
//# sourceMappingURL=bulkOperations.validator.js.map