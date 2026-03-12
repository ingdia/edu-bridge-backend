import { Request, Response } from 'express';
export declare class OpportunityController {
    createOpportunity(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOpportunities(req: Request, res: Response): Promise<void>;
    getMatchedOpportunities(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOpportunityById(req: Request, res: Response): Promise<void>;
    updateOpportunity(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteOpportunity(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    incrementApplyCount(req: Request, res: Response): Promise<void>;
}
export declare const opportunityController: OpportunityController;
//# sourceMappingURL=opportunity.controller.d.ts.map