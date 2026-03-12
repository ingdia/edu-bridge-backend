import { Request, Response } from 'express';
export declare class DigitalLiteracyController {
    startLesson(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    completeLesson(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMyProgress(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMyStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllProgress(req: Request, res: Response): Promise<void>;
}
export declare const digitalLiteracyController: DigitalLiteracyController;
//# sourceMappingURL=digitalLiteracy.controller.d.ts.map