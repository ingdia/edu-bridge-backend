"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerController = void 0;
require("../middlewares/auth.middleware");
const career_service_1 = require("../services/career.service");
const career_validator_1 = require("../validators/career.validator");
class CareerController {
    static async createOrUpdateCV(req, res, next) {
        try {
            const validated = career_validator_1.createCVSchema.parse(req.body);
            const studentUserId = req.user?.userId;
            if (!studentUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await career_service_1.CareerService.createOrUpdateCV(validated, studentUserId);
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
    static async getStudentCV(req, res, next) {
        try {
            const studentUserId = req.user?.userId;
            if (!studentUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await career_service_1.CareerService.getStudentCV(studentUserId);
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
    static async createApplication(req, res, next) {
        try {
            const validated = career_validator_1.createJobApplicationSchema.parse(req.body);
            const studentUserId = req.user?.userId;
            if (!studentUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await career_service_1.CareerService.createApplication(validated, studentUserId);
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
    static async updateApplicationStatus(req, res, next) {
        try {
            const { id } = req.params;
            const validated = career_validator_1.updateApplicationStatusSchema.parse(req.body);
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await career_service_1.CareerService.updateApplicationStatus(id, validated, userId);
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
    static async getStudentApplications(req, res, next) {
        try {
            const studentUserId = req.user?.userId;
            if (!studentUserId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await career_service_1.CareerService.getStudentApplications(studentUserId);
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
exports.CareerController = CareerController;
//# sourceMappingURL=career.controller.js.map