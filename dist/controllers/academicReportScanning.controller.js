"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicReportScanningController = void 0;
const academicReportScanning_service_1 = require("../services/academicReportScanning.service");
exports.academicReportScanningController = {
    async scanReport(req, res) {
        try {
            const { studentId, term, year } = req.body;
            const fileBuffer = req.file?.buffer;
            if (!fileBuffer) {
                return res.status(400).json({ success: false, error: 'No file uploaded' });
            }
            const scanResult = await academicReportScanning_service_1.academicReportScanningService.scanReport(fileBuffer, studentId, term, parseInt(year));
            res.json({ success: true, data: scanResult });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async processReport(req, res) {
        try {
            const { studentId, term, year, fileUrl } = req.body;
            const fileBuffer = req.file?.buffer;
            const userId = req.user?.userId || 'system';
            if (!fileBuffer) {
                return res.status(400).json({ success: false, error: 'No file uploaded' });
            }
            const result = await academicReportScanning_service_1.academicReportScanningService.processReport(fileBuffer, studentId, term, parseInt(year), fileUrl || 'uploaded', userId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async correctScannedData(req, res) {
        try {
            const { recordId } = req.params;
            const corrections = req.body;
            const result = await academicReportScanning_service_1.academicReportScanningService.correctScannedData(recordId, corrections);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getStudentScannedReports(req, res) {
        try {
            const { studentId } = req.params;
            const reports = await academicReportScanning_service_1.academicReportScanningService.getStudentScannedReports(studentId);
            res.json({ success: true, data: reports });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getLowConfidenceScans(req, res) {
        try {
            const threshold = parseFloat(req.query.threshold) || 0.7;
            const scans = await academicReportScanning_service_1.academicReportScanningService.getLowConfidenceScans(threshold);
            res.json({ success: true, data: scans });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=academicReportScanning.controller.js.map