import { Request, Response } from 'express';
export declare const offlineSyncController: {
    getModulesForOffline(req: Request, res: Response): Promise<void>;
    syncProgress(req: Request, res: Response): Promise<void>;
    syncSubmissions(req: Request, res: Response): Promise<void>;
    getUnsyncedData(req: Request, res: Response): Promise<void>;
    markAsSynced(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=offlineSync.controller.d.ts.map