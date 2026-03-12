"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityService = exports.OpportunityService = void 0;
const database_1 = __importDefault(require("../config/database"));
class OpportunityService {
    // Create opportunity
    async createOpportunity(adminId, data) {
        const opportunity = await database_1.default.opportunity.create({
            data: {
                ...data,
                postedBy: adminId,
            },
        });
        return opportunity;
    }
    // Get opportunities with filters
    async getOpportunities(filters) {
        const { type, gradeLevel, location, isActive = true, limit = 20, page = 1, } = filters;
        const where = { isActive };
        if (type)
            where.type = type;
        if (location)
            where.location = { contains: location, mode: 'insensitive' };
        if (gradeLevel)
            where.gradeLevel = { has: gradeLevel };
        const skip = (page - 1) * limit;
        const [opportunities, total] = await Promise.all([
            database_1.default.opportunity.findMany({
                where,
                orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
                take: limit,
                skip,
            }),
            database_1.default.opportunity.count({ where }),
        ]);
        return {
            opportunities,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Get matched opportunities for student based on academic results and skills
    async getMatchedOpportunities(userId) {
        // Get student profile
        const studentProfile = await database_1.default.studentProfile.findUnique({
            where: { userId },
            include: {
                academicReports: {
                    orderBy: { year: 'desc' },
                    take: 1,
                },
                progress: {
                    where: { completedAt: { not: null } },
                    include: { module: true },
                },
            },
        });
        if (!studentProfile) {
            throw new Error('Student profile not found');
        }
        // Extract student's grade level
        const gradeLevel = studentProfile.gradeLevel;
        // Calculate average score from progress
        const completedProgress = studentProfile.progress.filter((p) => p.score !== null);
        const avgScore = completedProgress.length > 0
            ? completedProgress.reduce((sum, p) => sum + (p.score || 0), 0) / completedProgress.length
            : 0;
        // Get completed module types (skills)
        const completedSkills = [
            ...new Set(studentProfile.progress
                .filter((p) => p.completedAt)
                .map((p) => p.module.type)),
        ];
        // Find matching opportunities
        const opportunities = await database_1.default.opportunity.findMany({
            where: {
                isActive: true,
                deadline: { gte: new Date() },
                OR: [
                    { gradeLevel: { has: gradeLevel } },
                    { gradeLevel: { isEmpty: true } },
                ],
            },
            orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
        });
        // Score and filter opportunities
        const scoredOpportunities = opportunities.map((opp) => {
            let matchScore = 0;
            // Grade level match
            if (opp.gradeLevel.includes(gradeLevel)) {
                matchScore += 30;
            }
            // Skills match
            const requiredSkills = opp.requiredSkills || [];
            const matchedSkills = requiredSkills.filter((skill) => completedSkills.some((cs) => cs.toLowerCase().includes(skill.toLowerCase())));
            if (requiredSkills.length > 0) {
                matchScore += (matchedSkills.length / requiredSkills.length) * 40;
            }
            else {
                matchScore += 20; // No specific skills required
            }
            // Academic performance match
            if (avgScore >= 70) {
                matchScore += 30;
            }
            else if (avgScore >= 50) {
                matchScore += 15;
            }
            return {
                ...opp,
                matchScore: Math.round(matchScore),
                matchedSkills,
            };
        });
        // Filter opportunities with match score >= 40 and sort by score
        return scoredOpportunities
            .filter((opp) => opp.matchScore >= 40)
            .sort((a, b) => b.matchScore - a.matchScore);
    }
    // Get opportunity by ID
    async getOpportunityById(id) {
        const opportunity = await database_1.default.opportunity.findUnique({
            where: { id },
            include: {
                postedByAdmin: {
                    select: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!opportunity) {
            throw new Error('Opportunity not found');
        }
        return opportunity;
    }
    // Update opportunity
    async updateOpportunity(id, data) {
        const opportunity = await database_1.default.opportunity.update({
            where: { id },
            data,
        });
        return opportunity;
    }
    // Delete opportunity
    async deleteOpportunity(id) {
        await database_1.default.opportunity.delete({
            where: { id },
        });
    }
    // Increment view count
    async incrementViewCount(id) {
        await database_1.default.opportunity.update({
            where: { id },
            data: {
                viewCount: { increment: 1 },
            },
        });
    }
    // Increment apply count
    async incrementApplyCount(id) {
        await database_1.default.opportunity.update({
            where: { id },
            data: {
                applyCount: { increment: 1 },
            },
        });
    }
}
exports.OpportunityService = OpportunityService;
exports.opportunityService = new OpportunityService();
//# sourceMappingURL=opportunity.service.js.map