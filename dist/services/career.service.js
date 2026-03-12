"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
class CareerService {
    static async createOrUpdateCV(data, studentUserId) {
        const studentProfile = await database_1.default.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile) {
            throw new Error('Student profile not found');
        }
        const cv = await database_1.default.cV.upsert({
            where: { studentId: studentProfile.id },
            update: data,
            create: {
                ...data,
                studentId: studentProfile.id,
            },
        });
        await (0, logger_1.logAudit)(studentUserId, 'CV_UPDATE', { cvId: cv.id });
        return { data: cv, message: 'CV saved successfully' };
    }
    static async getStudentCV(studentUserId) {
        const studentProfile = await database_1.default.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile) {
            throw new Error('Student profile not found');
        }
        const cv = await database_1.default.cV.findUnique({
            where: { studentId: studentProfile.id },
        });
        return { data: cv, message: 'CV retrieved successfully' };
    }
    static async createApplication(data, studentUserId) {
        const studentProfile = await database_1.default.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile) {
            throw new Error('Student profile not found');
        }
        const application = await database_1.default.jobApplication.create({
            data: {
                ...data,
                studentId: studentProfile.id,
            },
        });
        await (0, logger_1.logAudit)(studentUserId, 'APPLICATION_CREATE', { applicationId: application.id });
        return { data: application, message: 'Application created successfully' };
    }
    static async updateApplicationStatus(applicationId, data, userId) {
        const application = await database_1.default.jobApplication.update({
            where: { id: applicationId },
            data,
        });
        await (0, logger_1.logAudit)(userId, 'APPLICATION_UPDATE', { applicationId, status: data.status });
        return { data: application, message: 'Application updated successfully' };
    }
    static async getStudentApplications(studentUserId) {
        const studentProfile = await database_1.default.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile) {
            throw new Error('Student profile not found');
        }
        const applications = await database_1.default.jobApplication.findMany({
            where: { studentId: studentProfile.id },
            include: {
                cv: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return { data: applications, message: 'Applications retrieved successfully' };
    }
}
exports.CareerService = CareerService;
//# sourceMappingURL=career.service.js.map