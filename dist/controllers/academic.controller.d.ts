import { Request, Response, NextFunction } from 'express';
import '../middlewares/auth.middleware';
export declare class AcademicReportController {
    static uploadReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    static manualEntry(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStudentReports(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=academic.controller.d.ts.map