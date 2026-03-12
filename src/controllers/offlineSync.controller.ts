import { Request, Response } from 'express';
import { offlineSyncService } from '../services/offlineSync.service';

export const offlineSyncController = {
  async getModulesForOffline(req: Request, res: Response) {
    try {
      const { studentId } = req.params;

      const modules = await offlineSyncService.getModulesForOffline(studentId);
      res.json({ success: true, data: modules });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async syncProgress(req: Request, res: Response) {
    try {
      const { progressData } = req.body;

      const results = await offlineSyncService.syncProgress(progressData);
      res.json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async syncSubmissions(req: Request, res: Response) {
    try {
      const { submissions } = req.body;

      const results = await offlineSyncService.syncSubmissions(submissions);
      res.json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getUnsyncedData(req: Request, res: Response) {
    try {
      const { studentId } = req.params;

      const progress = await offlineSyncService.getUnsyncedProgress(studentId);
      const submissions = await offlineSyncService.getUnsyncedSubmissions(studentId);

      res.json({ success: true, data: { progress, submissions } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async markAsSynced(req: Request, res: Response) {
    try {
      const { progressIds, submissionIds } = req.body;

      const result = await offlineSyncService.markAsSynced(progressIds, submissionIds);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
