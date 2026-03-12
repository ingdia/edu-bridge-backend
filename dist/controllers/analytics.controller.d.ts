import { Request, Response, NextFunction } from 'express';
export declare class AnalyticsController {
    static getSystemOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStudentPerformance(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getModuleEngagement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMentorEffectiveness(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getProgressChart(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getApplicationStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchStudents(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchModules(req: Request, res: Response, next: NextFunction): Promise<void>;
    static searchOpportunities(req: Request, res: Response, next: NextFunction): Promise<void>;
    static globalSearch(req: Request, res: Response, next: NextFunction): Promise<void>;
    static bulkImportStudents(req: Request, res: Response, next: NextFunction): Promise<void>;
    static bulkGradeEntry(req: Request, res: Response, next: NextFunction): Promise<void>;
    static bulkSendNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    static bulkUpdateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=analytics.controller.d.ts.map