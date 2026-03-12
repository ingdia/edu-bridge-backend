"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateSubmissionSchema = exports.getSubmissionsQuerySchema = exports.exerciseSubmissionSchema = exports.digitalLiteracySubmissionSchema = exports.writingSubmissionSchema = exports.readingSubmissionSchema = exports.speakingSubmissionSchema = exports.listeningSubmissionSchema = exports.exerciseSubmissionBaseSchema = void 0;
const zod_1 = require("zod");
// Define ExerciseType enum locally
const ExerciseType = {
    LISTENING: 'LISTENING',
    SPEAKING: 'SPEAKING',
    READING: 'READING',
    WRITING: 'WRITING',
    DIGITAL_LITERACY: 'DIGITAL_LITERACY',
};
// Base schema
exports.exerciseSubmissionBaseSchema = zod_1.z.object({
    moduleId: zod_1.z.string().uuid('Invalid module ID'),
});
// Type-specific schemas
exports.listeningSubmissionSchema = zod_1.z.object({
    ...exports.exerciseSubmissionBaseSchema.shape,
    exerciseType: zod_1.z.literal(ExerciseType.LISTENING),
    responses: zod_1.z.array(zod_1.z.object({
        questionId: zod_1.z.string().uuid(),
        answer: zod_1.z.string().max(500),
        answeredAt: zod_1.z.coerce.date().optional(),
    })).min(1, 'At least one response required'),
});
exports.speakingSubmissionSchema = zod_1.z.object({
    ...exports.exerciseSubmissionBaseSchema.shape,
    exerciseType: zod_1.z.literal(ExerciseType.SPEAKING),
    transcript: zod_1.z.string().max(2000).optional(),
    recordingDuration: zod_1.z.number().min(1).max(600).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.readingSubmissionSchema = zod_1.z.object({
    ...exports.exerciseSubmissionBaseSchema.shape,
    exerciseType: zod_1.z.literal(ExerciseType.READING),
    responses: zod_1.z.array(zod_1.z.object({
        questionId: zod_1.z.string().uuid(),
        answer: zod_1.z.string().max(1000),
        questionType: zod_1.z.enum(['multiple_choice', 'short_answer', 'true_false']),
    })).min(1, 'At least one response required'),
});
exports.writingSubmissionSchema = zod_1.z.object({
    ...exports.exerciseSubmissionBaseSchema.shape,
    exerciseType: zod_1.z.literal(ExerciseType.WRITING),
    content: zod_1.z.string().min(50, 'Submission too short').max(5000, 'Submission too long'),
    wordCount: zod_1.z.number().min(10).optional(),
});
exports.digitalLiteracySubmissionSchema = zod_1.z.object({
    ...exports.exerciseSubmissionBaseSchema.shape,
    exerciseType: zod_1.z.literal(ExerciseType.DIGITAL_LITERACY),
    completed: zod_1.z.boolean(),
    artifactUrl: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
// Discriminated union for polymorphic validation
exports.exerciseSubmissionSchema = zod_1.z.discriminatedUnion('exerciseType', [
    exports.listeningSubmissionSchema,
    exports.speakingSubmissionSchema,
    exports.readingSubmissionSchema,
    exports.writingSubmissionSchema,
    exports.digitalLiteracySubmissionSchema,
]);
// Query filters
exports.getSubmissionsQuerySchema = zod_1.z.object({
    moduleId: zod_1.z.string().uuid().optional(),
    exerciseType: zod_1.z.enum(['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY']).optional(),
    studentId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.enum(['pending', 'evaluated', 'all']).default('all'),
    sortBy: zod_1.z.enum(['submittedAt', 'score', 'updatedAt']).default('submittedAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    page: zod_1.z.coerce.number().min(1).default(1),
});
// Mentor evaluation schema
exports.evaluateSubmissionSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(100).optional(),
    feedback: zod_1.z.string().max(2000, 'Feedback too long').optional(),
    rubricScores: zod_1.z.record(zod_1.z.string(), zod_1.z.number().min(0).max(10)).optional(),
    isPassed: zod_1.z.boolean().optional(),
    evaluatedAt: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=exercise.validator.js.map