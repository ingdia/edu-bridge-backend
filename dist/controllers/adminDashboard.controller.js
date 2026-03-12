"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDashboardController = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.adminDashboardController = {
    async getOverview(req, res) {
        try {
            const totalStudents = await database_1.default.studentProfile.count();
            const totalMentors = await database_1.default.mentorProfile.count();
            const totalModules = await database_1.default.learningModule.count({ where: { isActive: true } });
            const totalSessions = await database_1.default.mentorshipSession.count();
            const activeStudents = await database_1.default.user.count({
                where: { role: 'STUDENT', isActive: true }
            });
            const completedSessions = await database_1.default.mentorshipSession.count({
                where: { status: 'COMPLETED' }
            });
            const pendingSubmissions = await database_1.default.exerciseSubmission.count({
                where: { status: 'pending' }
            });
            res.json({
                success: true,
                data: {
                    totalStudents,
                    totalMentors,
                    totalModules,
                    totalSessions,
                    activeStudents,
                    completedSessions,
                    pendingSubmissions
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getStudentStats(req, res) {
        try {
            const studentsByGrade = await database_1.default.studentProfile.groupBy({
                by: ['gradeLevel'],
                _count: true
            });
            const studentsByDistrict = await database_1.default.studentProfile.groupBy({
                by: ['district'],
                _count: true
            });
            res.json({
                success: true,
                data: {
                    byGrade: studentsByGrade,
                    byDistrict: studentsByDistrict
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getProgressStats(req, res) {
        try {
            const completedModules = await database_1.default.progress.count({
                where: { completedAt: { not: null } }
            });
            const averageScore = await database_1.default.progress.aggregate({
                _avg: { score: true },
                where: { score: { not: null } }
            });
            const moduleCompletion = await database_1.default.progress.groupBy({
                by: ['moduleId'],
                _count: true,
                where: { completedAt: { not: null } }
            });
            res.json({
                success: true,
                data: {
                    completedModules,
                    averageScore: averageScore._avg.score,
                    moduleCompletion
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getSystemActivity(req, res) {
        try {
            const recentLogins = await database_1.default.user.findMany({
                where: { lastLogin: { not: null } },
                orderBy: { lastLogin: 'desc' },
                take: 10,
                select: {
                    email: true,
                    role: true,
                    lastLogin: true
                }
            });
            const recentSubmissions = await database_1.default.exerciseSubmission.findMany({
                orderBy: { submittedAt: 'desc' },
                take: 10,
                include: {
                    student: {
                        select: { fullName: true }
                    },
                    module: {
                        select: { title: true }
                    }
                }
            });
            res.json({
                success: true,
                data: {
                    recentLogins,
                    recentSubmissions
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getTopPerformers(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const topStudents = await database_1.default.progress.groupBy({
                by: ['studentId'],
                _avg: { score: true },
                _count: true,
                orderBy: { _avg: { score: 'desc' } },
                take: limit
            });
            const studentDetails = await Promise.all(topStudents.map(async (item) => {
                const student = await database_1.default.studentProfile.findUnique({
                    where: { id: item.studentId },
                    select: {
                        fullName: true,
                        gradeLevel: true,
                        schoolName: true
                    }
                });
                return {
                    ...student,
                    averageScore: item._avg.score,
                    completedModules: item._count
                };
            }));
            res.json({ success: true, data: studentDetails });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getSystemHealth(req, res) {
        try {
            const unsyncedProgress = await database_1.default.progress.count({
                where: { isSynced: false }
            });
            const unsyncedSubmissions = await database_1.default.exerciseSubmission.count({
                where: { isSynced: false }
            });
            const lowConfidenceScans = await database_1.default.academicReport.count({
                where: { overallGrade: null }
            });
            const unreadNotifications = await database_1.default.notification.count({
                where: { status: 'UNREAD' }
            });
            res.json({
                success: true,
                data: {
                    unsyncedProgress,
                    unsyncedSubmissions,
                    lowConfidenceScans,
                    unreadNotifications,
                    status: 'healthy'
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=adminDashboard.controller.js.map