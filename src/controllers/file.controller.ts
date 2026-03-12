// src/controllers/file.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  getAcademicReportFile,
  getAudioSubmissionFile,
  getModuleAudioFile,
  getCVFile,
  generateCloudinarySignedUrl,
} from '../services/file.service';

export class FileController {
  // ─────────────────────────────────────────────────────────────
  // DOWNLOAD ACADEMIC REPORT
  // ─────────────────────────────────────────────────────────────
  static async downloadAcademicReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reportId } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await getAcademicReportFile(reportId, userId, userRole);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Academic report file retrieved successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // STREAM AUDIO SUBMISSION
  // ─────────────────────────────────────────────────────────────
  static async streamAudioSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await getAudioSubmissionFile(submissionId, userId, userRole);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Audio file retrieved successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // STREAM MODULE AUDIO (LISTENING EXERCISES)
  // ─────────────────────────────────────────────────────────────
  static async streamModuleAudio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { moduleId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await getModuleAudioFile(moduleId, userId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Module audio retrieved successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // DOWNLOAD CV
  // ─────────────────────────────────────────────────────────────
  static async downloadCV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cvId } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const result = await getCVFile(cvId, userId, userRole);

      res.status(200).json({
        success: true,
        data: result,
        message: 'CV file retrieved successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // GENERATE SIGNED URL
  // ─────────────────────────────────────────────────────────────
  static async generateSignedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { publicId, resourceType, expiresIn } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      if (!publicId) {
        res.status(400).json({ success: false, message: 'publicId is required' });
        return;
      }

      const result = await generateCloudinarySignedUrl(
        publicId,
        resourceType || 'auto',
        expiresIn || 3600,
        userId
      );

      res.status(200).json({
        success: true,
        data: result,
        message: 'Signed URL generated successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }
}
