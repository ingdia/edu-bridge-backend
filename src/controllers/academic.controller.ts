import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
import { AcademicReportService } from '../services/academic.service';
import { uploadAcademicReportSchema, manualEntrySchema } from '../validators/academic.validator';

export class AcademicReportController {
  static async uploadReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = uploadAcademicReportSchema.parse(req.body);
      const adminId = req.user?.userId;

      if (!adminId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await AcademicReportService.uploadReport(validated, adminId);
      res.status(201).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async manualEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = manualEntrySchema.parse(req.body);
      const adminId = req.user?.userId;

      if (!adminId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await AcademicReportService.manualEntry(validated, adminId);
      res.status(201).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async getStudentReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId } = req.params;
      const result = await AcademicReportService.getStudentReports(studentId);
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
