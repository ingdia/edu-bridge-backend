import { Request, Response } from 'express';
import { academicReportScanningService } from '../services/academicReportScanning.service';

export const academicReportScanningController = {
  async scanReport(req: Request, res: Response) {
    try {
      const { studentId, term, year } = req.body;
      const fileBuffer = req.file?.buffer;

      if (!fileBuffer) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const scanResult = await academicReportScanningService.scanReport(
        fileBuffer,
        studentId,
        term,
        parseInt(year)
      );

      res.json({ success: true, data: scanResult });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async processReport(req: Request, res: Response) {
    try {
      const { studentId, term, year } = req.body;
      const fileBuffer = req.file?.buffer;

      if (!fileBuffer) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }

      const result = await academicReportScanningService.processReport(
        fileBuffer,
        studentId,
        term,
        parseInt(year)
      );

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async correctScannedData(req: Request, res: Response) {
    try {
      const { recordId } = req.params;
      const corrections = req.body;

      const result = await academicReportScanningService.correctScannedData(recordId, corrections);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getStudentScannedReports(req: Request, res: Response) {
    try {
      const { studentId } = req.params;

      const reports = await academicReportScanningService.getStudentScannedReports(studentId);
      res.json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getLowConfidenceScans(req: Request, res: Response) {
    try {
      const threshold = parseFloat(req.query.threshold as string) || 0.7;

      const scans = await academicReportScanningService.getLowConfidenceScans(threshold);
      res.json({ success: true, data: scans });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
