import { Request, Response } from 'express';
import prisma from '../config/database';

export const adminDashboardController = {
  async getOverview(req: Request, res: Response) {
    try {
      const totalStudents = await prisma.studentProfile.count();
      const totalMentors = await prisma.mentorProfile.count();
      const totalModules = await prisma.learningModule.count({ where: { isActive: true } });
      const totalSessions = await prisma.mentorshipSession.count();

      const activeStudents = await prisma.user.count({
        where: { role: 'STUDENT', isActive: true }
      });

      const completedSessions = await prisma.mentorshipSession.count({
        where: { status: 'COMPLETED' }
      });

      const pendingSubmissions = await prisma.exerciseSubmission.count({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getStudentStats(req: Request, res: Response) {
    try {
      const studentsByGrade = await prisma.studentProfile.groupBy({
        by: ['gradeLevel'],
        _count: true
      });

      const studentsByDistrict = await prisma.studentProfile.groupBy({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getProgressStats(req: Request, res: Response) {
    try {
      const completedModules = await prisma.progress.count({
        where: { completedAt: { not: null } }
      });

      const averageScore = await prisma.progress.aggregate({
        _avg: { score: true },
        where: { score: { not: null } }
      });

      const moduleCompletion = await prisma.progress.groupBy({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getSystemActivity(req: Request, res: Response) {
    try {
      const recentLogins = await prisma.user.findMany({
        where: { lastLogin: { not: null } },
        orderBy: { lastLogin: 'desc' },
        take: 10,
        select: {
          email: true,
          role: true,
          lastLogin: true
        }
      });

      const recentSubmissions = await prisma.exerciseSubmission.findMany({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getTopPerformers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const topStudents = await prisma.progress.groupBy({
        by: ['studentId'],
        _avg: { score: true },
        _count: true,
        orderBy: { _avg: { score: 'desc' } },
        take: limit
      });

      const studentDetails = await Promise.all(
        topStudents.map(async (item: any) => {
          const student = await prisma.studentProfile.findUnique({
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
        })
      );

      res.json({ success: true, data: studentDetails });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getSystemHealth(req: Request, res: Response) {
    try {
      const unsyncedProgress = await prisma.progress.count({
        where: { isSynced: false }
      });

      const unsyncedSubmissions = await prisma.exerciseSubmission.count({
        where: { isSynced: false }
      });

      const lowConfidenceScans = await prisma.academicReport.count({
        where: { overallGrade: null }
      });

      const unreadNotifications = await prisma.notification.count({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
