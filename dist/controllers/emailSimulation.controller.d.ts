import { Request, Response } from 'express';
export declare const emailSimulationController: {
    getInbox(req: Request, res: Response): Promise<void>;
    sendEmail(req: Request, res: Response): Promise<void>;
    markAsRead(req: Request, res: Response): Promise<void>;
    getSentEmails(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=emailSimulation.controller.d.ts.map