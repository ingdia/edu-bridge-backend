import { Request, Response } from 'express';
export declare const healthController: {
    getHealth(req: Request, res: Response): Promise<void>;
    getDatabaseHealth(req: Request, res: Response): Promise<void>;
    getSystemMetrics(req: Request, res: Response): Promise<void>;
    getDataMetrics(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=health.controller.d.ts.map