"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitalLiteracyController = exports.DigitalLiteracyController = void 0;
const digitalLiteracy_service_1 = require("../services/digitalLiteracy.service");
const logger_1 = require("../utils/logger");
class DigitalLiteracyController {
    // Start a digital literacy lesson
    async startLesson(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { lessonTitle, lessonType } = req.body;
            const progress = await digitalLiteracy_service_1.digitalLiteracyService.startLesson(userId, lessonTitle, lessonType);
            await (0, logger_1.logAudit)(userId, 'DIGITAL_LITERACY_LESSON_STARTED', {
                entityType: 'DigitalLiteracyProgress',
                entityId: progress.id,
                lessonTitle,
                lessonType,
            });
            res.status(201).json({
                success: true,
                message: 'Digital literacy lesson started',
                data: progress,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Complete a digital literacy lesson
    async completeLesson(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { lessonTitle, lessonType, score, practiceData } = req.body;
            const progress = await digitalLiteracy_service_1.digitalLiteracyService.completeLesson(userId, lessonTitle, lessonType, score, practiceData);
            await (0, logger_1.logAudit)(userId, 'DIGITAL_LITERACY_LESSON_COMPLETED', {
                entityType: 'DigitalLiteracyProgress',
                entityId: progress.id,
                lessonTitle,
                lessonType,
                score,
            });
            res.status(200).json({
                success: true,
                message: 'Digital literacy lesson completed',
                data: progress,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get student's digital literacy progress
    async getMyProgress(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { lessonType, completed } = req.query;
            const filters = {};
            if (lessonType)
                filters.lessonType = lessonType;
            if (completed)
                filters.completed = completed === 'true';
            const progress = await digitalLiteracy_service_1.digitalLiteracyService.getStudentProgress(userId, filters);
            res.status(200).json({
                success: true,
                data: progress,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get student's digital literacy statistics
    async getMyStats(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const stats = await digitalLiteracy_service_1.digitalLiteracyService.getStudentStats(userId);
            res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get all students' digital literacy progress (mentor/admin)
    async getAllProgress(req, res) {
        try {
            const { lessonType, completed } = req.query;
            const filters = {};
            if (lessonType)
                filters.lessonType = lessonType;
            if (completed)
                filters.completed = completed === 'true';
            const progress = await digitalLiteracy_service_1.digitalLiteracyService.getAllStudentsProgress(filters);
            res.status(200).json({
                success: true,
                data: progress,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.DigitalLiteracyController = DigitalLiteracyController;
exports.digitalLiteracyController = new DigitalLiteracyController();
//# sourceMappingURL=digitalLiteracy.controller.js.map