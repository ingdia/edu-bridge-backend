import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
export declare class MentorshipController {
    static createSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    static rescheduleSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    static cancelSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMentorSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStudentSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUpcomingSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCalendarView(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=mentorship.controller.d.ts.map