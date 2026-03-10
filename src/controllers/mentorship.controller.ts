import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
import { MentorshipService } from '../services/mentorship.service';
import { createSessionSchema, updateSessionSchema } from '../validators/mentorship.validator';

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

  static async getMentorSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mentorUserId = req.user?.userId;

      if (!mentorUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await MentorshipService.getMentorSessions(mentorUserId);
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

      const result = await MentorshipService.getStudentSessions(studentUserId);
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
