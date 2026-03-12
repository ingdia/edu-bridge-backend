import { Request, Response } from 'express';
import { healthMonitoringService } from '../services/healthMonitoring.service';

export const healthController = {
  async getHealth(req: Request, res: Response) {
    try {
      const report = await healthMonitoringService.getFullHealthReport();
      const statusCode = report.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getDatabaseHealth(req: Request, res: Response) {
    try {
      const health = await healthMonitoringService.checkDatabaseHealth();
      res.json({ success: true, data: health });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getSystemMetrics(req: Request, res: Response) {
    try {
      const metrics = await healthMonitoringService.getSystemMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getDataMetrics(req: Request, res: Response) {
    try {
      const metrics = await healthMonitoringService.getDataMetrics();
      res.json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
