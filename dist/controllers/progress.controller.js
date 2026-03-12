"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
require("../middlewares/auth.middleware");
const progress_service_1 = require("../services/progress.service");
const progress_validator_1 = require("../validators/progress.validator");
class ProgressController {
    /**
     * POST /api/progress/submit - Submit progress for a module
     */
    static async submitProgress(req, res, next) {
        try {
            const validated = progress_validator_1.submitProgressSchema.parse(req.body);
            const studentId = req.user?.userId;
            if (!studentId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await progress_service_1.ProgressService.submitProgress(studentId, validated);
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
     * GET /api/progress/me - Get current student's dashboard
     */
    static async getStudentDashboard(req, res, next) {
        try {
            const studentId = req.user?.userId;
            if (!studentId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            // Parse query filters with boolean conversion
            const queryResult = progress_validator_1.getProgressQuerySchema.safeParse(req.query);
            const filters = queryResult.success
                ? {
                    moduleId: queryResult.data.moduleId,
                    isCompleted: (0, progress_validator_1.parseBooleanParam)(queryResult.data.isCompleted),
                }
                : {};
            const result = await progress_service_1.ProgressService.getStudentDashboard(studentId, filters);
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
     * GET /api/progress/mentor/dashboard - Mentor view of assigned students
     */
    static async getMentorDashboard(req, res, next) {
        try {
            const mentorId = req.user?.userId;
            if (!mentorId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const filtersResult = progress_validator_1.mentorDashboardSchema.safeParse(req.query);
            const filters = filtersResult.success
                ? filtersResult.data
                : { sortBy: 'updatedAt', sortOrder: 'desc' };
            const result = await progress_service_1.ProgressService.getMentorDashboard(mentorId, filters);
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
     * GET /api/progress - Admin: Get all progress with filters
     */
    static async getAllProgress(req, res, next) {
        try {
            const queryResult = progress_validator_1.getProgressQuerySchema.safeParse(req.query);
            const filters = queryResult.success
                ? {
                    studentId: undefined, // Admin can filter by studentId if needed
                    moduleId: queryResult.data.moduleId,
                    isCompleted: (0, progress_validator_1.parseBooleanParam)(queryResult.data.isCompleted),
                    limit: queryResult.data.limit,
                    page: queryResult.data.page,
                }
                : { limit: 20, page: 1 };
            const result = await progress_service_1.ProgressService.getAllProgress(filters);
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
     * PATCH /api/progress/:id/feedback - Mentor adds/updates feedback
     */
    static async addMentorFeedback(req, res, next) {
        try {
            const { id: progressId } = req.params;
            const { feedback } = req.body;
            const mentorId = req.user?.userId;
            if (!mentorId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!feedback || typeof feedback !== 'string') {
                res.status(400).json({ success: false, message: 'Feedback is required' });
                return;
            }
            const result = await progress_service_1.ProgressService.addMentorFeedback(mentorId, progressId, feedback);
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
exports.ProgressController = ProgressController;
//# sourceMappingURL=progress.controller.js.map