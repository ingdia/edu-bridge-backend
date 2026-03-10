import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
import { ExerciseService } from '../services/exercise.service';
import {
  exerciseSubmissionSchema,
  getSubmissionsQuerySchema,
  evaluateSubmissionSchema,
} from '../validators/exercise.validator';

export class ExerciseController {
  /**
   * POST /api/exercises/submit - Submit exercise response
   * Handles text-based exercises; speaking exercises use /submit/speaking
   */
  static async submitExercise(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.userId;
      if (!studentId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      // Validate submission data
      const validated = exerciseSubmissionSchema.parse(req.body);
      
      // Speaking exercises require file upload - redirect to dedicated endpoint
      if (validated.exerciseType === 'SPEAKING') {
        res.status(400).json({ 
          success: false, 
          message: 'Speaking exercises require file upload. Use POST /api/exercises/submit/speaking' 
        });
        return;
      }

      const result = await ExerciseService.submitTextExercise(studentId, validated);
      res.status(201).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * POST /api/exercises/submit/speaking - Submit speaking exercise with audio
   * Requires multer middleware for file upload
   */
  static async submitSpeakingExercise(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.userId;
      if (!studentId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Audio file required' });
        return;
      }

      // Parse metadata from body
      const metadata = {
        transcript: req.body.transcript,
        recordingDuration: req.body.recordingDuration 
          ? parseFloat(req.body.recordingDuration) 
          : undefined,
        notes: req.body.notes,
      };

      const result = await ExerciseService.submitSpeakingExercise(
        studentId,
        req.body.moduleId,
        req.file,
        metadata
      );
      res.status(201).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/exercises/me - Get current student's submissions
   */
  static async getStudentSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentId = req.user?.userId;
      if (!studentId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const queryResult = getSubmissionsQuerySchema.safeParse(req.query);
      const filters = queryResult.success ? queryResult.data : { status: 'all' as const, sortBy: 'submittedAt' as const, sortOrder: 'desc' as const, limit: 20, page: 1 };

      const result = await ExerciseService.getStudentSubmissions(studentId, filters);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/exercises/mentor/submissions - Mentor view of assigned students' submissions
   */
  static async getMentorSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const mentorId = req.user?.userId;
      if (!mentorId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const queryResult = getSubmissionsQuerySchema.safeParse(req.query);
      const filters = queryResult.success ? queryResult.data : { status: 'pending' as const, sortBy: 'submittedAt' as const, sortOrder: 'desc' as const, limit: 20, page: 1 };

      const result = await ExerciseService.getMentorSubmissions(mentorId, filters);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * PATCH /api/exercises/:id/evaluate - Mentor evaluates a submission
   */
  static async evaluateSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: submissionId } = req.params;
      const mentorId = req.user?.userId;
      if (!mentorId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const evaluation = evaluateSubmissionSchema.parse(req.body);
      const result = await ExerciseService.evaluateSubmission(mentorId, submissionId, evaluation);
      res.status(200).json({ success: true, data: result.data, message: result.message });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/exercises - Admin: Get all submissions with filters
   */
  static async getAllSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const queryResult = getSubmissionsQuerySchema.safeParse(req.query);
      const filters = queryResult.success ? queryResult.data : { status: 'all' as const, sortBy: 'submittedAt' as const, sortOrder: 'desc' as const, limit: 20, page: 1 };

      const result = await ExerciseService.getAllSubmissions(filters);
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