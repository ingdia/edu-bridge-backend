"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitalLiteracyController = exports.DigitalLiteracyController = void 0;
const digitalLiteracyService = __importStar(require("../services/digitalLiteracy.service"));
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
            const progress = await digitalLiteracyService.startDigitalLiteracyLesson(userId, lessonTitle, lessonType);
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
            const progress = await digitalLiteracyService.completeDigitalLiteracyLesson(userId, lessonTitle, score, practiceData);
            await (0, logger_1.logAudit)(userId, 'DIGITAL_LITERACY_LESSON_COMPLETED', {
                entityType: 'DigitalLiteracyProgress',
                entityId: progress.count.toString(),
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
            const progress = await digitalLiteracyService.getDigitalLiteracyLessons(userId);
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
            const stats = await digitalLiteracyService.getDigitalLiteracyProgressSummary(userId);
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
            const progress = await digitalLiteracyService.getDigitalLiteracyLessons('all');
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