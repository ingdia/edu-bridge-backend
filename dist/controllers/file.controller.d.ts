import { Request, Response, NextFunction } from 'express';
export declare class FileController {
    static downloadAcademicReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    static streamAudioSubmission(req: Request, res: Response, next: NextFunction): Promise<void>;
    static streamModuleAudio(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadCV(req: Request, res: Response, next: NextFunction): Promise<void>;
    static generateSignedUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=file.controller.d.ts.map