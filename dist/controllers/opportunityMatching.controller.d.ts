import { Request, Response } from 'express';
export declare const opportunityMatchingController: {
    getMatchedOpportunities(req: Request, res: Response): Promise<void>;
    getTopPerformers(req: Request, res: Response): Promise<void>;
    calculateMatchScore(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=opportunityMatching.controller.d.ts.map