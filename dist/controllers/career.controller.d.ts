import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
export declare class CareerController {
    static createOrUpdateCV(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStudentCV(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createApplication(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStudentApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=career.controller.d.ts.map