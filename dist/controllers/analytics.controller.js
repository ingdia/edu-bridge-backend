"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const search_service_1 = require("../services/search.service");
const bulk_service_1 = require("../services/bulk.service");
class AnalyticsController {
    // ─────────────────────────────────────────────────────────────
    // SYSTEM OVERVIEW
    // ─────────────────────────────────────────────────────────────
    static async getSystemOverview(req, res, next) {
        try {
            const data = await (0, analytics_service_1.getSystemOverview)();
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // STUDENT PERFORMANCE
    // ─────────────────────────────────────────────────────────────
    static async getStudentPerformance(req, res, next) {
        try {
            const { gradeLevel, district, limit } = req.query;
            const data = await (0, analytics_service_1.getStudentPerformanceAnalytics)({
                gradeLevel: gradeLevel,
                district: district,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // MODULE ENGAGEMENT
    // ─────────────────────────────────────────────────────────────
    static async getModuleEngagement(req, res, next) {
        try {
            const data = await (0, analytics_service_1.getModuleEngagementAnalytics)();
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // MENTOR EFFECTIVENESS
    // ─────────────────────────────────────────────────────────────
    static async getMentorEffectiveness(req, res, next) {
        try {
            const data = await (0, analytics_service_1.getMentorEffectivenessAnalytics)();
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // PROGRESS OVER TIME (CHART DATA)
    // ─────────────────────────────────────────────────────────────
    static async getProgressChart(req, res, next) {
        try {
            const { studentId, days } = req.query;
            const data = await (0, analytics_service_1.getProgressOverTime)(studentId, days ? parseInt(days) : 30);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // APPLICATION STATISTICS
    // ─────────────────────────────────────────────────────────────
    static async getApplicationStats(req, res, next) {
        try {
            const data = await (0, analytics_service_1.getApplicationStatistics)();
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // SEARCH STUDENTS
    // ─────────────────────────────────────────────────────────────
    static async searchStudents(req, res, next) {
        try {
            const { q, gradeLevel, district, limit } = req.query;
            if (!q) {
                res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
                return;
            }
            const data = await (0, search_service_1.searchStudents)(q, {
                gradeLevel: gradeLevel,
                district: district,
                limit: limit ? parseInt(limit) : undefined,
            });
            res.status(200).json({ success: true, data, count: data.length });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // SEARCH MODULES
    // ─────────────────────────────────────────────────────────────
    static async searchModules(req, res, next) {
        try {
            const { q, type, difficulty, isActive, limit } = req.query;
            if (!q) {
                res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
                return;
            }
            const data = await (0, search_service_1.searchModules)(q, {
                type: type,
                difficulty: difficulty,
                isActive: isActive === 'true',
                limit: limit ? parseInt(limit) : undefined,
            });
            res.status(200).json({ success: true, data, count: data.length });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // SEARCH OPPORTUNITIES
    // ─────────────────────────────────────────────────────────────
    static async searchOpportunities(req, res, next) {
        try {
            const { q, type, gradeLevel, location, isActive, limit } = req.query;
            if (!q) {
                res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
                return;
            }
            const data = await (0, search_service_1.searchOpportunities)(q, {
                type: type,
                gradeLevel: gradeLevel,
                location: location,
                isActive: isActive === 'true',
                limit: limit ? parseInt(limit) : undefined,
            });
            res.status(200).json({ success: true, data, count: data.length });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // GLOBAL SEARCH
    // ─────────────────────────────────────────────────────────────
    static async globalSearch(req, res, next) {
        try {
            const { q, limit } = req.query;
            if (!q) {
                res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
                return;
            }
            const data = await (0, search_service_1.globalSearch)(q, limit ? parseInt(limit) : 10);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // BULK IMPORT STUDENTS
    // ─────────────────────────────────────────────────────────────
    static async bulkImportStudents(req, res, next) {
        try {
            const { students } = req.body;
            const adminId = req.user?.userId;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!Array.isArray(students) || students.length === 0) {
                res.status(400).json({ success: false, message: 'Students array is required' });
                return;
            }
            const result = await (0, bulk_service_1.bulkImportStudents)(students, adminId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // BULK GRADE ENTRY
    // ─────────────────────────────────────────────────────────────
    static async bulkGradeEntry(req, res, next) {
        try {
            const { grades } = req.body;
            const adminId = req.user?.userId;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!Array.isArray(grades) || grades.length === 0) {
                res.status(400).json({ success: false, message: 'Grades array is required' });
                return;
            }
            const result = await (0, bulk_service_1.bulkGradeEntry)(grades, adminId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // BULK SEND NOTIFICATIONS
    // ─────────────────────────────────────────────────────────────
    static async bulkSendNotifications(req, res, next) {
        try {
            const data = req.body;
            const senderId = req.user?.userId;
            if (!senderId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await (0, bulk_service_1.bulkSendNotifications)(data, senderId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // BULK UPDATE USER STATUS
    // ─────────────────────────────────────────────────────────────
    static async bulkUpdateUserStatus(req, res, next) {
        try {
            const { userIds, isActive } = req.body;
            const adminId = req.user?.userId;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!Array.isArray(userIds) || userIds.length === 0) {
                res.status(400).json({ success: false, message: 'userIds array is required' });
                return;
            }
            const result = await (0, bulk_service_1.bulkUpdateUserStatus)(userIds, isActive, adminId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map