import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
import { ProgressService } from '../services/progress.service';
import {
  submitProgressSchema,
  getProgressQuerySchema,
  mentorDashboardSchema,
  parseBooleanParam,
} from '../validators/progress.validator';

export class ProgressController {
  /**
   * POST /api/progress/submit - Submit progress for a module
   */
  static async submitProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = submitProgressSchema.parse(req.body);
      const studentId = req.user?.userId;

      if (!studentId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await ProgressService.submitProgress(studentId, validated);
      res.status(201).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/progress/me - Get current student's dashboard
   */
  static async getStudentDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.userId;
      if (!studentId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      // Parse query filters with boolean conversion
      const queryResult = getProgressQuerySchema.safeParse(req.query);
      const filters = queryResult.success
        ? {
            moduleId: queryResult.data.moduleId,
            isCompleted: parseBooleanParam(queryResult.data.isCompleted),
          }
        : {};

      const result = await ProgressService.getStudentDashboard(studentId, filters);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/progress/mentor/dashboard - Mentor view of assigned students
   */
  static async getMentorDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const mentorId = req.user?.userId;
      if (!mentorId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const filtersResult = mentorDashboardSchema.safeParse(req.query);
      const filters = filtersResult.success 
        ? filtersResult.data
        : { sortBy: 'updatedAt' as const, sortOrder: 'desc' as const };

      const result = await ProgressService.getMentorDashboard(mentorId, filters);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/progress - Admin: Get all progress with filters
   */
  static async getAllProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const queryResult = getProgressQuerySchema.safeParse(req.query);
      const filters = queryResult.success
        ? {
            studentId: undefined, // Admin can filter by studentId if needed
            moduleId: queryResult.data.moduleId,
            isCompleted: parseBooleanParam(queryResult.data.isCompleted),
            limit: queryResult.data.limit,
            page: queryResult.data.page,
          }
        : { limit: 20, page: 1 };

      const result = await ProgressService.getAllProgress(filters);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * PATCH /api/progress/:id/feedback - Mentor adds/updates feedback
   */
  static async addMentorFeedback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: progressId } = req.params;
      const { feedback } = req.body;
      const mentorId = req.user?.userId;

      if (!mentorId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      if (!feedback || typeof feedback !== 'string') {
        res.status(400).json({ success: false, message: 'Feedback is required' });
        return;
      }

      const result = await ProgressService.addMentorFeedback(mentorId, progressId, feedback);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }
}