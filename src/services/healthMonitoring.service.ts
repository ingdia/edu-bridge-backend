import prisma from '../config/database';
import { env } from '../config/env';

export const healthMonitoringService = {
  async checkDatabaseHealth() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', message: 'Database connection successful' };
    } catch (error: any) {
      return { status: 'unhealthy', message: error.message };
    }
  },

  async checkCloudinaryHealth() {
    try {
      if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY) {
        return { status: 'not_configured', message: 'Cloudinary not configured' };
      }
      return { status: 'healthy', message: 'Cloudinary configured' };
    } catch (error: any) {
      return { status: 'unhealthy', message: error.message };
    }
  },

  async checkEmailServiceHealth() {
    try {
      if (!env.SMTP_HOST || !env.SMTP_USER) {
        return { status: 'not_configured', message: 'Email service not configured' };
      }
      return { status: 'healthy', message: 'Email service configured' };
    } catch (error: any) {
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
    const [
      totalUsers,
      totalStudents,
      totalMentors,
      totalModules,
      totalSessions,
      totalSubmissions,
      totalOpportunities
    ] = await Promise.all([
      prisma.user.count(),
      prisma.studentProfile.count(),
      prisma.mentorProfile.count(),
      prisma.learningModule.count(),
      prisma.mentorshipSession.count(),
      prisma.exerciseSubmission.count(),
      prisma.opportunity.count()
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

    const errorLogs = await prisma.auditLog.count({
      where: {
        action: { contains: 'ERROR' },
        timestamp: { gte: last24Hours }
      }
    });

    const accessDenied = await prisma.auditLog.count({
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

    const overallStatus = 
      database.status === 'healthy' && 
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
