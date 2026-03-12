"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const file_service_1 = require("../services/file.service");
class FileController {
    // ─────────────────────────────────────────────────────────────
    // DOWNLOAD ACADEMIC REPORT
    // ─────────────────────────────────────────────────────────────
    static async downloadAcademicReport(req, res, next) {
        try {
            const { reportId } = req.params;
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId || !userRole) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await (0, file_service_1.getAcademicReportFile)(reportId, userId, userRole);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Academic report file retrieved successfully',
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // STREAM AUDIO SUBMISSION
    // ─────────────────────────────────────────────────────────────
    static async streamAudioSubmission(req, res, next) {
        try {
            const { submissionId } = req.params;
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId || !userRole) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await (0, file_service_1.getAudioSubmissionFile)(submissionId, userId, userRole);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Audio file retrieved successfully',
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // STREAM MODULE AUDIO (LISTENING EXERCISES)
    // ─────────────────────────────────────────────────────────────
    static async streamModuleAudio(req, res, next) {
        try {
            const { moduleId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await (0, file_service_1.getModuleAudioFile)(moduleId, userId);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Module audio retrieved successfully',
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // DOWNLOAD CV
    // ─────────────────────────────────────────────────────────────
    static async downloadCV(req, res, next) {
        try {
            const { cvId } = req.params;
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId || !userRole) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            const result = await (0, file_service_1.getCVFile)(cvId, userId, userRole);
            res.status(200).json({
                success: true,
                data: result,
                message: 'CV file retrieved successfully',
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
    // ─────────────────────────────────────────────────────────────
    // GENERATE SIGNED URL
    // ─────────────────────────────────────────────────────────────
    static async generateSignedUrl(req, res, next) {
        try {
            const { publicId, resourceType, expiresIn } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!publicId) {
                res.status(400).json({ success: false, message: 'publicId is required' });
                return;
            }
            const result = await (0, file_service_1.generateCloudinarySignedUrl)(publicId, resourceType || 'auto', expiresIn || 3600, userId);
            res.status(200).json({
                success: true,
                data: result,
                message: 'Signed URL generated successfully',
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    }
}
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map