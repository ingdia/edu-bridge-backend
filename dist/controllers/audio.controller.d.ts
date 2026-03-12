import { Request, Response } from 'express';
export declare const audioController: {
    uploadAudio(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAudioSubmissions(req: Request, res: Response): Promise<void>;
    evaluateAudio(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getListeningExercises(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=audio.controller.d.ts.map