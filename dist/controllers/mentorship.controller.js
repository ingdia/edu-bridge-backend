"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorshipController = void 0;
require("../middlewares/auth.middleware");
const mentorship_service_1 = require("../services/mentorship.service");
const mentorship_validator_1 = require("../validators/mentorship.validator");
class MentorshipController {
    static async createSession(req, res, next) {
        try {
            const validated = mentorship_validator_1.createSessionSchema.parse(req.body);
            const mentorUserId = req.user?.userId;
            if (!mentorUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await mentorship_service_1.MentorshipService.createSession(validated, mentorUserId);
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
    static async updateSession(req, res, next) {
        try {
            const { id } = req.params;
            const validated = mentorship_validator_1.updateSessionSchema.parse(req.body);
            const mentorUserId = req.user?.userId;
            if (!mentorUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await mentorship_service_1.MentorshipService.updateSession(id, validated, mentorUserId);
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
    static async rescheduleSession(req, res, next) {
        try {
            const { id } = req.params;
            const validated = mentorship_validator_1.rescheduleSessionSchema.parse(req.body);
            const mentorUserId = req.user?.userId;
            if (!mentorUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await mentorship_service_1.MentorshipService.rescheduleSession(id, validated, mentorUserId);
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
    static async cancelSession(req, res, next) {
        try {
            const { id } = req.params;
            const validated = mentorship_validator_1.cancelSessionSchema.parse(req.body);
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId || !userRole) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await mentorship_service_1.MentorshipService.cancelSession(id, validated, userId, userRole);
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
    static async getMentorSessions(req, res, next) {
        try {
            const mentorUserId = req.user?.userId;
            if (!mentorUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const filters = mentorship_validator_1.getSessionsQuerySchema.parse(req.query);
            const result = await mentorship_service_1.MentorshipService.getMentorSessions(mentorUserId, filters);
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
    static async getStudentSessions(req, res, next) {
        try {
            const studentUserId = req.user?.userId;
            if (!studentUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const filters = mentorship_validator_1.getSessionsQuerySchema.parse(req.query);
            const result = await mentorship_service_1.MentorshipService.getStudentSessions(studentUserId, filters);
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
    static async getUpcomingSessions(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId || !userRole) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await mentorship_service_1.MentorshipService.getUpcomingSessions(userId, userRole);
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
    static async getCalendarView(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const { month, year } = req.query;
            if (!userId || !userRole) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!month || !year) {
                res.status(400).json({ success: false, message: 'Month and year are required' });
                return;
            }
            const result = await mentorship_service_1.MentorshipService.getCalendarView(userId, userRole, parseInt(month), parseInt(year));
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
exports.MentorshipController = MentorshipController;
//# sourceMappingURL=mentorship.controller.js.map