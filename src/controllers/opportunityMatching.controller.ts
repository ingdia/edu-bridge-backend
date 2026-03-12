import { Request, Response } from 'express';
import { 
  matchOpportunitiesForStudent,
  getTopPerformersForOpportunity,
  recommendOpportunitiesByType
} from '../services/opportunityMatching.service';

export const opportunityMatchingController = {
  async getMatchedOpportunities(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const type = req.query.type as string;
      const minScore = parseFloat(req.query.minScore as string) || 50;

      let opportunities;
      if (type) {
        opportunities = await recommendOpportunitiesByType(studentId, type as any);
      } else {
        opportunities = await matchOpportunitiesForStudent(studentId);
      }

      // Filter by minScore if provided
      if (opportunities.opportunities) {
        opportunities.opportunities = opportunities.opportunities.filter(
          (opp: any) => opp.matchScore >= minScore
        );
      }

      res.json({ success: true, data: opportunities });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getTopPerformers(req: Request, res: Response) {
    try {
      const { opportunityId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const students = await getTopPerformersForOpportunity(opportunityId, limit);
      res.json({ success: true, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async calculateMatchScore(req: Request, res: Response) {
    try {
      const { studentId, opportunityId } = req.params;

      const result = await matchOpportunitiesForStudent(studentId);
      const opportunity = result.opportunities.find((opp: any) => opp.id === opportunityId);

      if (!opportunity) {
        return res.status(404).json({ success: false, error: 'Opportunity not found or not matched' });
      }

      res.json({ success: true, data: { score: opportunity.matchScore } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
