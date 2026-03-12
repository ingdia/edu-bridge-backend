"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLessonsQuerySchema = exports.completeLessonSchema = exports.startLessonSchema = void 0;
const zod_1 = require("zod");
exports.startLessonSchema = zod_1.z.object({
    body: zod_1.z.object({
        lessonTitle: zod_1.z.string().min(1, 'Lesson title is required'),
        lessonType: zod_1.z.enum(['email', 'computer_basics', 'internet_safety', 'digital_communication']),
    }),
});
exports.completeLessonSchema = zod_1.z.object({
    body: zod_1.z.object({
        lessonTitle: zod_1.z.string().min(1, 'Lesson title is required'),
        lessonType: zod_1.z.enum(['email', 'computer_basics', 'internet_safety', 'digital_communication']),
        score: zod_1.z.number().min(0).max(100).optional(),
        practiceData: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
exports.getLessonsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        lessonType: zod_1.z.enum(['email', 'computer_basics', 'internet_safety', 'digital_communication']).optional(),
        completed: zod_1.z.enum(['true', 'false']).optional(),
    }),
});
//# sourceMappingURL=digitalLiteracy.validator.js.map