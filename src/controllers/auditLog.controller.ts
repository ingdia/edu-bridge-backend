import { Request, Response } from 'express';
import { auditLogService } from '../services/auditLog.service';

export const auditLogController = {
  async getUserLogs(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const logs = await auditLogService.getUserLogs(userId, limit);
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getActionLogs(req: Request, res: Response) {
    try {
      const { action } = req.params;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const logs = await auditLogService.getActionLogs(action, startDate, endDate);
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getEntityLogs(req: Request, res: Response) {
    try {
      const { entityType, entityId } = req.params;

      const logs = await auditLogService.getEntityLogs(entityType, entityId);
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getRecentLogs(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 100;

      const logs = await auditLogService.getRecentLogs(limit);
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
