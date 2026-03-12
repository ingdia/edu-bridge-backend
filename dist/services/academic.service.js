"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicReportService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const fileUpload_1 = require("../utils/fileUpload");
class AcademicReportService {
    static async uploadReport(data, adminId, file) {
        let uploadResult = null;
        // Upload file to Cloudinary if provided
        if (file) {
            uploadResult = await (0, fileUpload_1.uploadToCloudinary)(file.buffer, file.originalname, 'ACADEMIC_REPORT');
        }
        const report = await database_1.default.academicReport.create({
            data: {
                ...data,
                fileUrl: uploadResult?.url || data.fileUrl,
                fileName: file?.originalname || data.fileName,
                fileSize: file?.size || data.fileSize,
                enteredBy: adminId,
            },
            include: {
                student: {
                    select: { fullName: true, gradeLevel: true },
                },
            },
        });
        await (0, logger_1.logAudit)(adminId, 'ACADEMIC_REPORT_UPLOAD', {
            reportId: report.id,
            studentId: data.studentId,
            fileUrl: uploadResult?.url,
        });
        return { data: report, message: 'Academic report uploaded successfully' };
    }
    static async manualEntry(data, adminId) {
        const report = await database_1.default.academicReport.create({
            data: {
                ...data,
                fileUrl: '',
                enteredBy: adminId,
            },
            include: {
                student: {
                    select: { fullName: true, gradeLevel: true },
                },
            },
        });
        await (0, logger_1.logAudit)(adminId, 'ACADEMIC_REPORT_MANUAL_ENTRY', { reportId: report.id, studentId: data.studentId });
        return { data: report, message: 'Academic report entered successfully' };
    }
    static async getStudentReports(studentId) {
        const reports = await database_1.default.academicReport.findMany({
            where: { studentId },
            orderBy: [{ year: 'desc' }, { term: 'desc' }],
        });
        return { data: reports, message: 'Reports retrieved successfully' };
    }
    static async deleteReport(reportId, adminId) {
        const report = await database_1.default.academicReport.findUnique({
            where: { id: reportId },
        });
        if (!report) {
            throw new Error('Report not found');
        }
        // Delete file from Cloudinary if exists
        if (report.fileUrl) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = report.fileUrl.split('/');
                const publicIdWithExt = urlParts.slice(-2).join('/');
                const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
                await (0, fileUpload_1.deleteFromCloudinary)(publicId, 'auto');
            }
            catch (error) {
                console.error('[DELETE_FILE_ERROR]', error);
                // Continue with database deletion even if file deletion fails
            }
        }
        await database_1.default.academicReport.delete({
            where: { id: reportId },
        });
        await (0, logger_1.logAudit)(adminId, 'REPORT_VIEW', { reportId, action: 'deleted' });
        return { message: 'Report deleted successfully' };
    }
}
exports.AcademicReportService = AcademicReportService;
//# sourceMappingURL=academic.service.js.map