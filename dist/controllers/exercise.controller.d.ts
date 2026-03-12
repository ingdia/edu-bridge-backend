import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
export declare class ExerciseController {
    /**
     * POST /api/exercises/submit - Submit exercise response
     * Handles text-based exercises; speaking exercises use /submit/speaking
     */
    static submitExercise(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * POST /api/exercises/submit/speaking - Submit speaking exercise with audio
     * Requires multer middleware for file upload
     */
    static submitSpeakingExercise(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/exercises/me - Get current student's submissions
     */
    static getStudentSubmissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/exercises/mentor/submissions - Mentor view of assigned students' submissions
     */
    static getMentorSubmissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/exercises/:id/evaluate - Mentor evaluates a submission
     */
    static evaluateSubmission(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/exercises - Admin: Get all submissions with filters
     */
    static getAllSubmissions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=exercise.controller.d.ts.map