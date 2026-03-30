import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
import { CareerService } from '../services/career.service';
import { createCVSchema, createJobApplicationSchema, updateApplicationStatusSchema } from '../validators/career.validator';

export class CareerController {
  static async createOrUpdateCV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createCVSchema.parse(req.body);
      const studentUserId = req.user?.userId;

      if (!studentUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await CareerService.createOrUpdateCV(validated, studentUserId);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async getStudentCV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentUserId = req.user?.userId;

      if (!studentUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await CareerService.getStudentCV(studentUserId);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createJobApplicationSchema.parse(req.body);
      const studentUserId = req.user?.userId;

      if (!studentUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await CareerService.createApplication(validated, studentUserId);
      res.status(201).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error && error.message === 'Student profile not found') {
        res.status(400).json({ success: false, message: 'Complete your profile before applying' });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateApplicationStatusSchema.parse(req.body);
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await CareerService.updateApplicationStatus(id, validated, userId);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async getStudentApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentUserId = req.user?.userId;

      if (!studentUserId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await CareerService.getStudentApplications(studentUserId);
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
}
