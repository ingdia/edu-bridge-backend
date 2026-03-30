import { Request, Response } from 'express';
import { opportunityService } from '../services/opportunity.service';
import { logAudit } from '../utils/logger';

export class OpportunityController {
  // Create opportunity (admin only)
  async createOpportunity(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const opportunityData = req.body;
      const opportunity = await opportunityService.createOpportunity(userId, opportunityData);

      await logAudit(userId, 'OPPORTUNITY_CREATED', {
        entityType: 'Opportunity',
        entityId: opportunity.id,
      });

      res.status(201).json({
        success: true,
        message: 'Opportunity created successfully',
        data: opportunity,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all opportunities with filters
  async getOpportunities(req: Request, res: Response) {
    try {
      const { type, gradeLevel, location, isActive, limit, page } = req.query;

      const filters: any = {};
      if (type) filters.type = type as string;
      if (gradeLevel) filters.gradeLevel = gradeLevel as string;
      if (location) filters.location = location as string;
      if (isActive) filters.isActive = isActive === 'true';
      if (limit) filters.limit = parseInt(limit as string);
      if (page) filters.page = parseInt(page as string);

      const opportunities = await opportunityService.getOpportunities(filters);

      res.status(200).json({
        success: true,
        data: opportunities,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get matched opportunities for student
  async getMatchedOpportunities(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const opportunities = await opportunityService.getMatchedOpportunities(userId);

      res.status(200).json({
        success: true,
        data: opportunities,
      });
    } catch (error: any) {
      if (error.message === 'Student profile not found') {
        return res.status(200).json({ success: true, data: [] });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get opportunity by ID
  async getOpportunityById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const opportunity = await opportunityService.getOpportunityById(id);

      // Increment view count
      if (userId) {
        await opportunityService.incrementViewCount(id);
      }

      res.status(200).json({
        success: true,
        data: opportunity,
      });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // Update opportunity (admin only)
  async updateOpportunity(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      const updateData = req.body;

      const opportunity = await opportunityService.updateOpportunity(id, updateData);

      await logAudit(userId, 'OPPORTUNITY_UPDATED', {
        entityType: 'Opportunity',
        entityId: id,
      });

      res.status(200).json({
        success: true,
        message: 'Opportunity updated successfully',
        data: opportunity,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete opportunity (admin only)
  async deleteOpportunity(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;

      await opportunityService.deleteOpportunity(id);

      await logAudit(userId, 'OPPORTUNITY_DELETED', {
        entityType: 'Opportunity',
        entityId: id,
      });

      res.status(200).json({
        success: true,
        message: 'Opportunity deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Increment apply count
  async incrementApplyCount(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await opportunityService.incrementApplyCount(id);

      res.status(200).json({
        success: true,
        message: 'Apply count incremented',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const opportunityController = new OpportunityController();
