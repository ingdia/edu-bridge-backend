import { Request, Response } from 'express';
import { bulkOperationsService } from '../services/bulkOperations.service';

export const bulkOperationsController = {
  async importStudents(req: Request, res: Response) {
    try {
      const { students } = req.body;
      const createdBy = (req as any).user.userId;

      const result = await bulkOperationsService.importStudents(students, createdBy);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async uploadGrades(req: Request, res: Response) {
    try {
      const { grades } = req.body;
      const uploadedBy = (req as any).user.userId;

      const result = await bulkOperationsService.uploadGrades(grades, uploadedBy);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async sendBulkNotifications(req: Request, res: Response) {
    try {
      const notificationData = req.body;
      const sentBy = (req as any).user.userId;

      const result = await bulkOperationsService.sendBulkNotifications(notificationData, sentBy);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async assignMentors(req: Request, res: Response) {
    try {
      const { assignments } = req.body;

      const result = await bulkOperationsService.assignMentorsToStudents(assignments);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
