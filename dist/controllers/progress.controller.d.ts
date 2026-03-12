import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
export declare class ProgressController {
    /**
     * POST /api/progress/submit - Submit progress for a module
     */
    static submitProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/progress/me - Get current student's dashboard
     */
    static getStudentDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/progress/mentor/dashboard - Mentor view of assigned students
     */
    static getMentorDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * GET /api/progress - Admin: Get all progress with filters
     */
    static getAllProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * PATCH /api/progress/:id/feedback - Mentor adds/updates feedback
     */
    static addMentorFeedback(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=progress.controller.d.ts.map