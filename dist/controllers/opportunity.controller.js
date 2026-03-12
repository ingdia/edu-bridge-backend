"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityController = exports.OpportunityController = void 0;
const opportunity_service_1 = require("../services/opportunity.service");
const logger_1 = require("../utils/logger");
class OpportunityController {
    // Create opportunity (admin only)
    async createOpportunity(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const opportunityData = req.body;
            const opportunity = await opportunity_service_1.opportunityService.createOpportunity(userId, opportunityData);
            await (0, logger_1.logAudit)(userId, 'OPPORTUNITY_CREATED', {
                entityType: 'Opportunity',
                entityId: opportunity.id,
            });
            res.status(201).json({
                success: true,
                message: 'Opportunity created successfully',
                data: opportunity,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get all opportunities with filters
    async getOpportunities(req, res) {
        try {
            const { type, gradeLevel, location, isActive, limit, page } = req.query;
            const filters = {};
            if (type)
                filters.type = type;
            if (gradeLevel)
                filters.gradeLevel = gradeLevel;
            if (location)
                filters.location = location;
            if (isActive)
                filters.isActive = isActive === 'true';
            if (limit)
                filters.limit = parseInt(limit);
            if (page)
                filters.page = parseInt(page);
            const opportunities = await opportunity_service_1.opportunityService.getOpportunities(filters);
            res.status(200).json({
                success: true,
                data: opportunities,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get matched opportunities for student
    async getMatchedOpportunities(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const opportunities = await opportunity_service_1.opportunityService.getMatchedOpportunities(userId);
            res.status(200).json({
                success: true,
                data: opportunities,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get opportunity by ID
    async getOpportunityById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const opportunity = await opportunity_service_1.opportunityService.getOpportunityById(id);
            // Increment view count
            if (userId) {
                await opportunity_service_1.opportunityService.incrementViewCount(id);
            }
            res.status(200).json({
                success: true,
                data: opportunity,
            });
        }
        catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
    // Update opportunity (admin only)
    async updateOpportunity(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { id } = req.params;
            const updateData = req.body;
            const opportunity = await opportunity_service_1.opportunityService.updateOpportunity(id, updateData);
            await (0, logger_1.logAudit)(userId, 'OPPORTUNITY_UPDATED', {
                entityType: 'Opportunity',
                entityId: id,
            });
            res.status(200).json({
                success: true,
                message: 'Opportunity updated successfully',
                data: opportunity,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Delete opportunity (admin only)
    async deleteOpportunity(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { id } = req.params;
            await opportunity_service_1.opportunityService.deleteOpportunity(id);
            await (0, logger_1.logAudit)(userId, 'OPPORTUNITY_DELETED', {
                entityType: 'Opportunity',
                entityId: id,
            });
            res.status(200).json({
                success: true,
                message: 'Opportunity deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Increment apply count
    async incrementApplyCount(req, res) {
        try {
            const { id } = req.params;
            await opportunity_service_1.opportunityService.incrementApplyCount(id);
            res.status(200).json({
                success: true,
                message: 'Apply count incremented',
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.OpportunityController = OpportunityController;
exports.opportunityController = new OpportunityController();
//# sourceMappingURL=opportunity.controller.js.map