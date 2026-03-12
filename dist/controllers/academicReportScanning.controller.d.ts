import { Request, Response } from 'express';
export declare const academicReportScanningController: {
    scanReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    processReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    correctScannedData(req: Request, res: Response): Promise<void>;
    getStudentScannedReports(req: Request, res: Response): Promise<void>;
    getLowConfidenceScans(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=academicReportScanning.controller.d.ts.map