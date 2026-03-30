import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
import { MentorshipService } from '../services/mentorship.service';
import { createSessionSchema, updateSessionSchema, rescheduleSessionSchema, cancelSessionSchema, getSessionsQuerySchema } from '../validators/mentorship.validator';

export class MentorshipController {
  static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createSessionSchema.parse(req.body);
      const mentorUserId = req.user?.userId;

      if (!mentorUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await MentorshipService.createSession(validated, mentorUserId);
      res.status(201).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async updateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateSessionSchema.parse(req.body);
      const mentorUserId = req.user?.userId;

      if (!mentorUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await MentorshipService.updateSession(id, validated, mentorUserId);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async rescheduleSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = rescheduleSessionSchema.parse(req.body);
      const mentorUserId = req.user?.userId;

      if (!mentorUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await MentorshipService.rescheduleSession(id, validated, mentorUserId);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async cancelSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = cancelSessionSchema.parse(req.body);
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await MentorshipService.cancelSession(id, validated, userId, userRole);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async getMentorSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mentorUserId = req.user?.userId;

      if (!mentorUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const filters = getSessionsQuerySchema.parse(req.query);
      const result = await MentorshipService.getMentorSessions(mentorUserId, filters);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async getStudentSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentUserId = req.user?.userId;

      if (!studentUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const filters = getSessionsQuerySchema.parse(req.query);
      const result = await MentorshipService.getStudentSessions(studentUserId, filters);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error && error.message === 'Student profile not found') {
        res.status(200).json({ success: true, data: [], message: 'No profile yet' });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async getUpcomingSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await MentorshipService.getUpcomingSessions(userId, userRole);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async getCalendarView(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const { month, year } = req.query;

      if (!userId || !userRole) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      if (!month || !year) {
        res.status(400).json({ success: false, message: 'Month and year are required' });
        return;
      }

      const result = await MentorshipService.getCalendarView(
        userId,
        userRole,
        parseInt(month as string),
        parseInt(year as string)
      );
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
