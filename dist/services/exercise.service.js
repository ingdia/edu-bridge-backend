"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const fileUpload_1 = require("../utils/fileUpload");
// Define enum types locally
const ExerciseType = {
    LISTENING: 'LISTENING',
    SPEAKING: 'SPEAKING',
    READING: 'READING',
    WRITING: 'WRITING',
    DIGITAL_LITERACY: 'DIGITAL_LITERACY',
};
const SessionStatus = {
    SCHEDULED: 'SCHEDULED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW',
};
class ExerciseService {
    /**
     * Submit text-based exercise (LISTENING, READING, WRITING, DIGITAL_LITERACY)
     */
    static async submitTextExercise(studentId, data) {
        const { moduleId, exerciseType } = data;
        // Verify module
        const module = await database_1.default.learningModule.findUnique({ where: { id: moduleId } });
        if (!module)
            throw new Error('Module not found');
        if (!module.isActive)
            throw new Error('Cannot submit to inactive module');
        if (module.type !== exerciseType) {
            throw new Error(`Module type ${module.type} does not match submission type ${exerciseType}`);
        }
        // Prepare submission content by type
        let submissionContent;
        switch (data.exerciseType) {
            case ExerciseType.LISTENING:
            case ExerciseType.READING:
                submissionContent = { responses: data.responses };
                break;
            case ExerciseType.WRITING:
                submissionContent = { content: data.content, wordCount: data.wordCount };
                break;
            case ExerciseType.DIGITAL_LITERACY:
                submissionContent = {
                    completed: data.completed,
                    artifactUrl: data.artifactUrl,
                    notes: data.notes
                };
                break;
            default:
                throw new Error(`Text exercise type ${data.exerciseType} not supported`);
        }
        // Create submission + optionally update progress
        const result = await database_1.default.$transaction(async (tx) => {
            const submission = await tx.exerciseSubmission.create({
                data: {
                    studentId,
                    moduleId,
                    exerciseType,
                    submissionContent: submissionContent,
                    status: 'pending',
                    submittedAt: new Date(),
                },
            });
            // Update progress: mark completed for digital literacy, or just sync timestamp
            const progressUpdate = await tx.progress.upsert({
                where: { studentId_moduleId: { studentId, moduleId } },
                update: { lastSyncedAt: new Date() },
                create: {
                    studentId,
                    moduleId,
                    completedAt: exerciseType === ExerciseType.DIGITAL_LITERACY && data.completed
                        ? new Date() : null,
                    lastSyncedAt: new Date(),
                },
            });
            return { submission, progressUpdated: !!progressUpdate };
        });
        await (0, logger_1.logAudit)(studentId, 'EXERCISE_SUBMITTED', { moduleId, exerciseType });
        return {
            data: { submission: result.submission, progressUpdated: result.progressUpdated },
            message: 'Exercise submitted successfully'
        };
    }
    /**
     * Submit speaking exercise with audio file
     */
    static async submitSpeakingExercise(studentId, moduleId, file, metadata) {
        // Verify module
        const module = await database_1.default.learningModule.findUnique({ where: { id: moduleId } });
        if (!module)
            throw new Error('Module not found');
        if (!module.isActive)
            throw new Error('Cannot submit to inactive module');
        if (module.type !== ExerciseType.SPEAKING) {
            throw new Error(`Module type ${module.type} does not match SPEAKING submission`);
        }
        // Validate file
        if (!file)
            throw new Error('Audio file required');
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/webm'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid audio format. Allowed: mp3, wav, m4a, ogg, webm');
        }
        // Upload to Cloudinary
        const uploadResult = await (0, fileUpload_1.uploadToCloudinary)(file.buffer, file.originalname, 'AUDIO');
        // Create submission record
        const submission = await database_1.default.exerciseSubmission.create({
            data: {
                studentId,
                moduleId,
                exerciseType: ExerciseType.SPEAKING,
                submissionContent: {
                    transcript: metadata.transcript,
                    recordingDuration: metadata.recordingDuration,
                    notes: metadata.notes,
                    audioUrl: uploadResult.url,
                    originalFilename: file.originalname,
                    publicId: uploadResult.publicId,
                },
                status: 'pending',
                submittedAt: new Date(),
            },
        });
        await (0, logger_1.logAudit)(studentId, 'SPEAKING_EXERCISE_SUBMITTED', { moduleId, filename: file.originalname, fileSize: file.size, cloudinaryUrl: uploadResult.url });
        return { data: { submission, fileUrl: uploadResult.url }, message: 'Speaking exercise submitted successfully' };
    }
    /**
     * Get student's own submissions
     */
    static async getStudentSubmissions(studentId, filters) {
        const { moduleId, exerciseType, status, sortBy, sortOrder, limit = 10, page = 1 } = filters;
        const skip = (page - 1) * limit;
        const where = { studentId };
        if (moduleId)
            where.moduleId = moduleId;
        if (exerciseType)
            where.exerciseType = exerciseType;
        if (status !== 'all')
            where.status = status;
        const [submissions, total] = await Promise.all([
            database_1.default.exerciseSubmission.findMany({
                where,
                include: {
                    module: { select: { id: true, title: true, type: true, difficulty: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            database_1.default.exerciseSubmission.count({ where }),
        ]);
        const summary = {
            total: submissions.length,
            pending: submissions.filter((s) => s.status === 'pending').length,
            evaluated: submissions.filter((s) => s.status === 'evaluated').length,
            averageScore: submissions.filter((s) => s.score !== null).length > 0
                ? parseFloat((submissions.reduce((acc, s) => acc + (s.score ?? 0), 0) /
                    submissions.filter((s) => s.score !== null).length).toFixed(1))
                : null,
        };
        return {
            data: { submissions, summary, pagination: { total, page: page, limit: limit } },
            message: 'Submissions retrieved successfully',
        };
    }
    /**
     * Get submissions for mentor review (assigned students only)
     */
    static async getMentorSubmissions(mentorId, filters) {
        const { studentId, moduleId, exerciseType, status, sortBy, sortOrder, limit = 10, page = 1 } = filters;
        const skip = (page - 1) * limit;
        // Get assigned student IDs
        const sessions = await database_1.default.mentorshipSession.findMany({
            where: { mentorId, status: { in: [SessionStatus.SCHEDULED, SessionStatus.COMPLETED] } },
            select: { studentId: true },
        });
        const assignedStudentIds = sessions.map((s) => s.studentId);
        if (assignedStudentIds.length === 0) {
            return { data: { submissions: [], summary: {}, pagination: { total: 0, page: page, limit: limit } }, message: 'No assigned students' };
        }
        const where = {
            studentId: { in: assignedStudentIds },
            status: status === 'all' ? undefined : status,
        };
        if (studentId) {
            if (!assignedStudentIds.includes(studentId)) {
                throw new Error('Unauthorized: Student not assigned to this mentor');
            }
            where.studentId = studentId;
        }
        if (moduleId)
            where.moduleId = moduleId;
        if (exerciseType)
            where.exerciseType = exerciseType;
        const [submissions, total] = await Promise.all([
            database_1.default.exerciseSubmission.findMany({
                where,
                include: {
                    student: {
                        select: {
                            id: true,
                            fullName: true,
                            user: { select: { email: true } },
                        },
                    },
                    module: { select: { id: true, title: true, type: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            database_1.default.exerciseSubmission.count({ where }),
        ]);
        const summary = {
            total,
            pending: submissions.filter((s) => s.status === 'pending').length,
            evaluated: submissions.filter((s) => s.status === 'evaluated').length,
            byType: ['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY'].reduce((acc, type) => {
                acc[type] = submissions.filter((s) => s.exerciseType === type).length;
                return acc;
            }, {}),
        };
        await (0, logger_1.logAudit)(mentorId, 'MENTOR_SUBMISSIONS_VIEWED', { filters, count: submissions.length });
        return {
            data: { submissions, summary, pagination: { total, page: page, limit: limit } },
            message: 'Mentor submissions retrieved successfully',
        };
    }
    /**
     * Mentor evaluates a submission
     */
    static async evaluateSubmission(mentorId, submissionId, evaluation) {
        const submission = await database_1.default.exerciseSubmission.findUnique({
            where: { id: submissionId },
            include: { student: true },
        });
        if (!submission)
            throw new Error('Submission not found');
        if (submission.status === 'evaluated') {
            throw new Error('Submission already evaluated');
        }
        // Verify mentor assignment
        const assignment = await database_1.default.mentorshipSession.findFirst({
            where: {
                mentorId,
                studentId: submission.studentId,
                status: { in: [SessionStatus.SCHEDULED, SessionStatus.COMPLETED] },
            },
        });
        if (!assignment) {
            throw new Error('Unauthorized: Mentor not assigned to this student');
        }
        // Update submission
        const updated = await database_1.default.exerciseSubmission.update({
            where: { id: submissionId },
            data: {
                score: evaluation.score ?? null,
                feedback: evaluation.feedback ?? null,
                rubricScores: evaluation.rubricScores ?? null,
                isPassed: evaluation.isPassed ?? null,
                evaluatedAt: evaluation.evaluatedAt ?? new Date(),
                evaluatedBy: mentorId,
                status: 'evaluated',
            },
            include: {
                module: { select: { id: true, title: true, type: true } },
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        user: { select: { email: true } },
                    },
                },
            },
        });
        // Sync score to Progress table if provided
        if (evaluation.score !== undefined) {
            await database_1.default.progress.update({
                where: { studentId_moduleId: { studentId: submission.studentId, moduleId: submission.moduleId } },
                data: {
                    score: evaluation.score,
                    lastSyncedAt: new Date(),
                    completedAt: evaluation.isPassed ? new Date() : undefined,
                },
            });
        }
        await (0, logger_1.logAudit)(mentorId, 'SUBMISSION_EVALUATED', { studentId: submission.studentId, score: evaluation.score, isPassed: evaluation.isPassed });
        return { data: updated, message: 'Evaluation saved successfully' };
    }
    /**
     * Admin: Get all submissions with filters
     */
    static async getAllSubmissions(filters) {
        const { moduleId, exerciseType, studentId, status, sortBy, sortOrder, limit = 10, page = 1 } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (moduleId)
            where.moduleId = moduleId;
        if (exerciseType)
            where.exerciseType = exerciseType;
        if (studentId)
            where.studentId = studentId;
        if (status !== 'all')
            where.status = status;
        const [submissions, total] = await Promise.all([
            database_1.default.exerciseSubmission.findMany({
                where,
                include: {
                    student: {
                        select: {
                            id: true,
                            fullName: true,
                            user: { select: { email: true } },
                        },
                    },
                    module: { select: { id: true, title: true, type: true } },
                    evaluator: {
                        select: { id: true, user: { select: { email: true } } },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            database_1.default.exerciseSubmission.count({ where }),
        ]);
        return {
            data: {
                submissions,
                pagination: {
                    total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1,
                },
            },
            message: 'All submissions retrieved successfully',
        };
    }
}
exports.ExerciseService = ExerciseService;
//# sourceMappingURL=exercise.service.js.map