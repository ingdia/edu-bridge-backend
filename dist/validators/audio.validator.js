"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudioSubmissionsSchema = exports.evaluateAudioSchema = exports.uploadAudioSchema = void 0;
const zod_1 = require("zod");
exports.uploadAudioSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID'),
        moduleId: zod_1.z.string().uuid('Invalid module ID'),
        exerciseType: zod_1.z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']).optional(),
        duration: zod_1.z.number().positive().optional(),
        transcript: zod_1.z.string().optional()
    })
});
exports.evaluateAudioSchema = zod_1.z.object({
    params: zod_1.z.object({
        submissionId: zod_1.z.string().uuid('Invalid submission ID')
    }),
    body: zod_1.z.object({
        score: zod_1.z.number().min(0).max(100, 'Score must be between 0 and 100'),
        feedback: zod_1.z.string().min(10, 'Feedback must be at least 10 characters').optional(),
        rubricScores: zod_1.z.record(zod_1.z.number()).optional()
    })
});
exports.getAudioSubmissionsSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().uuid('Invalid student ID')
    }),
    query: zod_1.z.object({
        exerciseType: zod_1.z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']).optional()
    })
});
//# sourceMappingURL=audio.validator.js.map