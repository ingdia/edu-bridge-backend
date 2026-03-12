// src/controllers/analytics.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  getSystemOverview,
  getStudentPerformanceAnalytics,
  getModuleEngagementAnalytics,
  getMentorEffectivenessAnalytics,
  getProgressOverTime,
  getApplicationStatistics,
} from '../services/analytics.service';
import {
  searchStudents,
  searchModules,
  searchOpportunities,
  globalSearch,
} from '../services/search.service';
import {
  bulkImportStudents,
  bulkGradeEntry,
  bulkSendNotifications,
  bulkUpdateUserStatus,
} from '../services/bulk.service';

export class AnalyticsController {
  // ─────────────────────────────────────────────────────────────
  // SYSTEM OVERVIEW
  // ─────────────────────────────────────────────────────────────
  static async getSystemOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await getSystemOverview();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // STUDENT PERFORMANCE
  // ─────────────────────────────────────────────────────────────
  static async getStudentPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gradeLevel, district, limit } = req.query;
      const data = await getStudentPerformanceAnalytics({
        gradeLevel: gradeLevel as string,
        district: district as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // MODULE ENGAGEMENT
  // ─────────────────────────────────────────────────────────────
  static async getModuleEngagement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await getModuleEngagementAnalytics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // MENTOR EFFECTIVENESS
  // ─────────────────────────────────────────────────────────────
  static async getMentorEffectiveness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await getMentorEffectivenessAnalytics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PROGRESS OVER TIME (CHART DATA)
  // ─────────────────────────────────────────────────────────────
  static async getProgressChart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, days } = req.query;
      const data = await getProgressOverTime(
        studentId as string,
        days ? parseInt(days as string) : 30
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // APPLICATION STATISTICS
  // ─────────────────────────────────────────────────────────────
  static async getApplicationStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await getApplicationStatistics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SEARCH STUDENTS
  // ─────────────────────────────────────────────────────────────
  static async searchStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, gradeLevel, district, limit } = req.query;

      if (!q) {
        res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
        return;
      }

      const data = await searchStudents(q as string, {
        gradeLevel: gradeLevel as string,
        district: district as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.status(200).json({ success: true, data, count: data.length });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SEARCH MODULES
  // ─────────────────────────────────────────────────────────────
  static async searchModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, type, difficulty, isActive, limit } = req.query;

      if (!q) {
        res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
        return;
      }

      const data = await searchModules(q as string, {
        type: type as string,
        difficulty: difficulty as string,
        isActive: isActive === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.status(200).json({ success: true, data, count: data.length });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SEARCH OPPORTUNITIES
  // ─────────────────────────────────────────────────────────────
  static async searchOpportunities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, type, gradeLevel, location, isActive, limit } = req.query;

      if (!q) {
        res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
        return;
      }

      const data = await searchOpportunities(q as string, {
        type: type as string,
        gradeLevel: gradeLevel as string,
        location: location as string,
        isActive: isActive === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.status(200).json({ success: true, data, count: data.length });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // GLOBAL SEARCH
  // ─────────────────────────────────────────────────────────────
  static async globalSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, limit } = req.query;

      if (!q) {
        res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
        return;
      }

      const data = await globalSearch(q as string, limit ? parseInt(limit as string) : 10);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // BULK IMPORT STUDENTS
  // ─────────────────────────────────────────────────────────────
  static async bulkImportStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { students } = req.body;
      const adminId = req.user?.userId;

      if (!adminId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      if (!Array.isArray(students) || students.length === 0) {
        res.status(400).json({ success: false, message: 'Students array is required' });
        return;
      }

      const result = await bulkImportStudents(students, adminId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // BULK GRADE ENTRY
  // ─────────────────────────────────────────────────────────────
  static async bulkGradeEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { grades } = req.body;
      const adminId = req.user?.userId;

      if (!adminId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      if (!Array.isArray(grades) || grades.length === 0) {
        res.status(400).json({ success: false, message: 'Grades array is required' });
        return;
      }

      const result = await bulkGradeEntry(grades, adminId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // BULK SEND NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────
  static async bulkSendNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const senderId = req.user?.userId;

      if (!senderId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await bulkSendNotifications(data, senderId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // BULK UPDATE USER STATUS
  // ─────────────────────────────────────────────────────────────
  static async bulkUpdateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userIds, isActive } = req.body;
      const adminId = req.user?.userId;

      if (!adminId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      if (!Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ success: false, message: 'userIds array is required' });
        return;
      }

      const result = await bulkUpdateUserStatus(userIds, isActive, adminId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
