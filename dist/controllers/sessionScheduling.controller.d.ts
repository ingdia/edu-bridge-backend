import { Request, Response } from 'express';
export declare const sessionSchedulingController: {
    createSession(req: Request, res: Response): Promise<void>;
    rescheduleSession(req: Request, res: Response): Promise<void>;
    cancelSession(req: Request, res: Response): Promise<void>;
    completeSession(req: Request, res: Response): Promise<void>;
    getUpcomingSessions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createWeeklyLabSessions(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=sessionScheduling.controller.d.ts.map