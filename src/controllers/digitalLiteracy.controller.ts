import { Request, Response } from 'express';
import { digitalLiteracyService } from '../services/digitalLiteracy.service';
import { logAudit } from '../utils/logger';

export class DigitalLiteracyController {
  // Start a digital literacy lesson
  async startLesson(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { lessonTitle, lessonType } = req.body;

      const progress = await digitalLiteracyService.startLesson(userId, lessonTitle, lessonType);

      await logAudit(userId, 'DIGITAL_LITERACY_LESSON_STARTED', {
        entityType: 'DigitalLiteracyProgress',
        entityId: progress.id,
        lessonTitle,
        lessonType,
      });

      res.status(201).json({
        success: true,
        message: 'Digital literacy lesson started',
        data: progress,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Complete a digital literacy lesson
  async completeLesson(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { lessonTitle, lessonType, score, practiceData } = req.body;

      const progress = await digitalLiteracyService.completeLesson(
        userId,
        lessonTitle,
        lessonType,
        score,
        practiceData
      );

      await logAudit(userId, 'DIGITAL_LITERACY_LESSON_COMPLETED', {
        entityType: 'DigitalLiteracyProgress',
        entityId: progress.id,
        lessonTitle,
        lessonType,
        score,
      });

      res.status(200).json({
        success: true,
        message: 'Digital literacy lesson completed',
        data: progress,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get student's digital literacy progress
  async getMyProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { lessonType, completed } = req.query;

      const filters: any = {};
      if (lessonType) filters.lessonType = lessonType as string;
      if (completed) filters.completed = completed === 'true';

      const progress = await digitalLiteracyService.getStudentProgress(userId, filters);

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get student's digital literacy statistics
  async getMyStats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const stats = await digitalLiteracyService.getStudentStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all students' digital literacy progress (mentor/admin)
  async getAllProgress(req: Request, res: Response) {
    try {
      const { lessonType, completed } = req.query;

      const filters: any = {};
      if (lessonType) filters.lessonType = lessonType as string;
      if (completed) filters.completed = completed === 'true';

      const progress = await digitalLiteracyService.getAllStudentsProgress(filters);

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const digitalLiteracyController = new DigitalLiteracyController();
