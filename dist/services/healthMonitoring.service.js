"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthMonitoringService = void 0;
const database_1 = __importDefault(require("../config/database"));
const env_1 = require("../config/env");
exports.healthMonitoringService = {
    async checkDatabaseHealth() {
        try {
            await database_1.default.$queryRaw `SELECT 1`;
            return { status: 'healthy', message: 'Database connection successful' };
        }
        catch (error) {
            return { status: 'unhealthy', message: error.message };
        }
    },
    async checkCloudinaryHealth() {
        try {
            if (!env_1.env.CLOUDINARY_CLOUD_NAME || !env_1.env.CLOUDINARY_API_KEY) {
                return { status: 'not_configured', message: 'Cloudinary not configured' };
            }
            return { status: 'healthy', message: 'Cloudinary configured' };
        }
        catch (error) {
            return { status: 'unhealthy', message: error.message };
        }
    },
    async checkEmailServiceHealth() {
        try {
            if (!env_1.env.SMTP_HOST || !env_1.env.SMTP_USER) {
                return { status: 'not_configured', message: 'Email service not configured' };
            }
            return { status: 'healthy', message: 'Email service configured' };
        }
        catch (error) {
            return { status: 'unhealthy', message: error.message };
        }
    },
    async getSystemMetrics() {
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        return {
            uptime: {
                seconds: uptime,
                formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
            },
            memory: {
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
            },
            nodeVersion: process.version,
            platform: process.platform
        };
    },
    async getDataMetrics() {
        const [totalUsers, totalStudents, totalMentors, totalModules, totalSessions, totalSubmissions, totalOpportunities] = await Promise.all([
            database_1.default.user.count(),
            database_1.default.studentProfile.count(),
            database_1.default.mentorProfile.count(),
            database_1.default.learningModule.count(),
            database_1.default.mentorshipSession.count(),
            database_1.default.exerciseSubmission.count(),
            database_1.default.opportunity.count()
        ]);
        return {
            totalUsers,
            totalStudents,
            totalMentors,
            totalModules,
            totalSessions,
            totalSubmissions,
            totalOpportunities
        };
    },
    async getErrorMetrics() {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const errorLogs = await database_1.default.auditLog.count({
            where: {
                action: { contains: 'ERROR' },
                timestamp: { gte: last24Hours }
            }
        });
        const accessDenied = await database_1.default.auditLog.count({
            where: {
                action: 'ACCESS_DENIED',
                timestamp: { gte: last24Hours }
            }
        });
        return {
            errors24h: errorLogs,
            accessDenied24h: accessDenied
        };
    },
    async getFullHealthReport() {
        const [database, cloudinary, email, systemMetrics, dataMetrics, errorMetrics] = await Promise.all([
            this.checkDatabaseHealth(),
            this.checkCloudinaryHealth(),
            this.checkEmailServiceHealth(),
            this.getSystemMetrics(),
            this.getDataMetrics(),
            this.getErrorMetrics()
        ]);
        const overallStatus = database.status === 'healthy' &&
            cloudinary.status !== 'unhealthy' &&
            email.status !== 'unhealthy'
            ? 'healthy'
            : 'degraded';
        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            services: {
                database,
                cloudinary,
                email
            },
            system: systemMetrics,
            data: dataMetrics,
            errors: errorMetrics
        };
    }
};
//# sourceMappingURL=healthMonitoring.service.js.map