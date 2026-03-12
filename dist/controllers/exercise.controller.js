"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseController = void 0;
require("../middlewares/auth.middleware");
const exercise_service_1 = require("../services/exercise.service");
const exercise_validator_1 = require("../validators/exercise.validator");
class ExerciseController {
    /**
     * POST /api/exercises/submit - Submit exercise response
     * Handles text-based exercises; speaking exercises use /submit/speaking
     */
    static async submitExercise(req, res, next) {
        try {
            const studentId = req.user?.userId;
            if (!studentId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            // Validate submission data
            const validated = exercise_validator_1.exerciseSubmissionSchema.parse(req.body);
            // Speaking exercises require file upload - redirect to dedicated endpoint
            if (validated.exerciseType === 'SPEAKING') {
                res.status(400).json({
                    success: false,
                    message: 'Speaking exercises require file upload. Use POST /api/exercises/submit/speaking'
                });
                return;
            }
            const result = await exercise_service_1.ExerciseService.submitTextExercise(studentId, validated);
            res.status(201).json({ success: true, data: result.data, message: result.message });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }
    /**
     * POST /api/exercises/submit/speaking - Submit speaking exercise with audio
     * Requires multer middleware for file upload
     */
    static async submitSpeakingExercise(req, res, next) {
        try {
            const studentId = req.user?.userId;
            if (!studentId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!req.file) {
                res.status(400).json({ success: false, message: 'Audio file required' });
                return;
            }
            // Parse metadata from body
            const metadata = {
                transcript: req.body.transcript,
                recordingDuration: req.body.recordingDuration
                    ? parseFloat(req.body.recordingDuration)
                    : undefined,
                notes: req.body.notes,
            };
            const result = await exercise_service_1.ExerciseService.submitSpeakingExercise(studentId, req.body.moduleId, req.file, metadata);
            res.status(201).json({ success: true, data: result.data, message: result.message });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }
    /**
     * GET /api/exercises/me - Get current student's submissions
     */
    static async getStudentSubmissions(req, res, next) {
        try {
            const studentId = req.user?.userId;
            if (!studentId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const queryResult = exercise_validator_1.getSubmissionsQuerySchema.safeParse(req.query);
            const filters = queryResult.success ? queryResult.data : { status: 'all', sortBy: 'submittedAt', sortOrder: 'desc', limit: 20, page: 1 };
            const result = await exercise_service_1.ExerciseService.getStudentSubmissions(studentId, filters);
            res.status(200).json({ success: true, data: result.data, message: result.message });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }
    /**
     * GET /api/exercises/mentor/submissions - Mentor view of assigned students' submissions
     */
    static async getMentorSubmissions(req, res, next) {
        try {
            const mentorId = req.user?.userId;
            if (!mentorId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const queryResult = exercise_validator_1.getSubmissionsQuerySchema.safeParse(req.query);
            const filters = queryResult.success ? queryResult.data : { status: 'pending', sortBy: 'submittedAt', sortOrder: 'desc', limit: 20, page: 1 };
            const result = await exercise_service_1.ExerciseService.getMentorSubmissions(mentorId, filters);
            res.status(200).json({ success: true, data: result.data, message: result.message });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }
    /**
     * PATCH /api/exercises/:id/evaluate - Mentor evaluates a submission
     */
    static async evaluateSubmission(req, res, next) {
        try {
            const { id: submissionId } = req.params;
            const mentorId = req.user?.userId;
            if (!mentorId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const evaluation = exercise_validator_1.evaluateSubmissionSchema.parse(req.body);
            const result = await exercise_service_1.ExerciseService.evaluateSubmission(mentorId, submissionId, evaluation);
            res.status(200).json({ success: true, data: result.data, message: result.message });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }
    /**
     * GET /api/exercises - Admin: Get all submissions with filters
     */
    static async getAllSubmissions(req, res, next) {
        try {
            const queryResult = exercise_validator_1.getSubmissionsQuerySchema.safeParse(req.query);
            const filters = queryResult.success ? queryResult.data : { status: 'all', sortBy: 'submittedAt', sortOrder: 'desc', limit: 20, page: 1 };
            const result = await exercise_service_1.ExerciseService.getAllSubmissions(filters);
            res.status(200).json({ success: true, data: result.data, message: result.message });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }
}
exports.ExerciseController = ExerciseController;
//# sourceMappingURL=exercise.controller.js.map