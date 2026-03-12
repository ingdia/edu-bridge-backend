"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicReportController = void 0;
require("../middlewares/auth.middleware");
const academic_service_1 = require("../services/academic.service");
const academic_validator_1 = require("../validators/academic.validator");
class AcademicReportController {
    static async uploadReport(req, res, next) {
        try {
            const validated = academic_validator_1.uploadAcademicReportSchema.parse(req.body);
            const adminId = req.user?.userId;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await academic_service_1.AcademicReportService.uploadReport(validated, adminId);
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
    static async manualEntry(req, res, next) {
        try {
            const validated = academic_validator_1.manualEntrySchema.parse(req.body);
            const adminId = req.user?.userId;
            if (!adminId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await academic_service_1.AcademicReportService.manualEntry(validated, adminId);
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
    static async getStudentReports(req, res, next) {
        try {
            const { studentId } = req.params;
            const result = await academic_service_1.AcademicReportService.getStudentReports(studentId);
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
exports.AcademicReportController = AcademicReportController;
//# sourceMappingURL=academic.controller.js.map