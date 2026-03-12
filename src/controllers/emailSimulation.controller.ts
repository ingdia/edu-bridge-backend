import { Request, Response } from 'express';
import { emailSimulationService } from '../services/emailSimulation.service';

export const emailSimulationController = {
  async getInbox(req: Request, res: Response) {
    try {
      const { studentId } = req.params;

      const emails = await emailSimulationService.getInbox(studentId);
      res.json({ success: true, data: emails });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async sendEmail(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const draft = req.body;

      const result = await emailSimulationService.sendEmail(studentId, draft);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      const { studentId, emailId } = req.params;

      await emailSimulationService.markAsRead(studentId, emailId);
      res.json({ success: true, message: 'Email marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getSentEmails(req: Request, res: Response) {
    try {
      const { studentId } = req.params;

      const emails = await emailSimulationService.getSentEmails(studentId);
      res.json({ success: true, data: emails });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
