"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityMatchingController = void 0;
const opportunityMatching_service_1 = require("../services/opportunityMatching.service");
exports.opportunityMatchingController = {
    async getMatchedOpportunities(req, res) {
        try {
            const { studentId } = req.params;
            const type = req.query.type;
            const minScore = parseFloat(req.query.minScore) || 50;
            let opportunities;
            if (type) {
                opportunities = await (0, opportunityMatching_service_1.recommendOpportunitiesByType)(studentId, type);
            }
            else {
                opportunities = await (0, opportunityMatching_service_1.matchOpportunitiesForStudent)(studentId);
            }
            // Filter by minScore if provided
            if (opportunities.opportunities) {
                opportunities.opportunities = opportunities.opportunities.filter((opp) => opp.matchScore >= minScore);
            }
            res.json({ success: true, data: opportunities });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getTopPerformers(req, res) {
        try {
            const { opportunityId } = req.params;
            const limit = parseInt(req.query.limit) || 10;
            const students = await (0, opportunityMatching_service_1.getTopPerformersForOpportunity)(opportunityId, limit);
            res.json({ success: true, data: students });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async calculateMatchScore(req, res) {
        try {
            const { studentId, opportunityId } = req.params;
            const result = await (0, opportunityMatching_service_1.matchOpportunitiesForStudent)(studentId);
            const opportunity = result.opportunities.find((opp) => opp.id === opportunityId);
            if (!opportunity) {
                return res.status(404).json({ success: false, error: 'Opportunity not found or not matched' });
            }
            res.json({ success: true, data: { score: opportunity.matchScore } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=opportunityMatching.controller.js.map