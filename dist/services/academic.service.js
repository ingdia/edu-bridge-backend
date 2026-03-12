"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicReportService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class AcademicReportService {
    static async uploadReport(data, adminId) {
        const report = await database_1.default.academicReport.create({
            data: {
                ...data,
                enteredBy: adminId,
            },
            include: {
                student: {
                    select: { fullName: true, gradeLevel: true },
                },
            },
        });
        await (0, logger_1.logAudit)(adminId, 'ACADEMIC_REPORT_UPLOAD', { reportId: report.id, studentId: data.studentId });
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
}
exports.AcademicReportService = AcademicReportService;
//# sourceMappingURL=academic.service.js.map