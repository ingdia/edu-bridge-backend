"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendOpportunitiesByType = exports.getTopPerformersForOpportunity = exports.matchOpportunitiesForStudent = void 0;
// src/services/opportunityMatching.service.ts
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
// ─────────────────────────────────────────────────────────────
// MATCH OPPORTUNITIES TO STUDENT
// ─────────────────────────────────────────────────────────────
const matchOpportunitiesForStudent = async (studentId) => {
    // Get student profile with academic results
    const student = await database_1.default.studentProfile.findUnique({
        where: { id: studentId },
        include: {
            academicReports: {
                orderBy: { year: 'desc' },
                take: 1
            },
            progress: {
                where: { score: { not: null } },
                select: { score: true }
            }
        }
    });
    if (!student) {
        throw new Error('Student not found');
    }
    // Calculate student's average score from progress
    const progressScores = student.progress.map((p) => p.score).filter((s) => s !== null);
    const averageScore = progressScores.length > 0
        ? progressScores.reduce((a, b) => a + b, 0) / progressScores.length
        : 0;
    // Get latest academic report
    const latestReport = student.academicReports[0];
    const overallGrade = latestReport?.overallGrade || '';
    // Extract skills from progress (subjects completed)
    const skills = extractSkillsFromProgress(student.progress);
    // Get all active opportunities
    const opportunities = await database_1.default.opportunity.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    });
    // Score and rank opportunities
    const matchedOpportunities = opportunities.map(opportunity => {
        const matchScore = calculateMatchScore(student.gradeLevel, averageScore, overallGrade, skills, opportunity);
        return {
            ...opportunity,
            matchScore,
            matchReasons: generateMatchReasons(student.gradeLevel, averageScore, overallGrade, skills, opportunity)
        };
    });
    // Sort by match score (highest first)
    matchedOpportunities.sort((a, b) => b.matchScore - a.matchScore);
    // Return top matches (score > 50)
    const topMatches = matchedOpportunities.filter((o) => o.matchScore > 50);
    await (0, logger_1.logAudit)(studentId, 'OPPORTUNITY_MATCH_VIEW', {
        totalOpportunities: opportunities.length,
        matchedCount: topMatches.length
    });
    return {
        student: {
            id: student.id,
            fullName: student.fullName,
            gradeLevel: student.gradeLevel,
            averageScore: parseFloat(averageScore.toFixed(1)),
            overallGrade
        },
        opportunities: topMatches,
        totalMatches: topMatches.length
    };
};
exports.matchOpportunitiesForStudent = matchOpportunitiesForStudent;
// ─────────────────────────────────────────────────────────────
// CALCULATE MATCH SCORE
// ─────────────────────────────────────────────────────────────
const calculateMatchScore = (studentGradeLevel, averageScore, overallGrade, skills, opportunity) => {
    let score = 0;
    // Grade level match (30 points)
    if (opportunity.gradeLevel && opportunity.gradeLevel.length > 0) {
        if (opportunity.gradeLevel.includes(studentGradeLevel)) {
            score += 30;
        }
    }
    else {
        // If no grade level specified, give partial points
        score += 15;
    }
    // Academic performance match (40 points)
    if (opportunity.minGrade) {
        const minGradeValue = parseGradeToScore(opportunity.minGrade);
        const studentGradeValue = averageScore || parseGradeToScore(overallGrade);
        if (studentGradeValue >= minGradeValue) {
            score += 40;
        }
        else if (studentGradeValue >= minGradeValue - 10) {
            score += 20; // Close to requirement
        }
    }
    else {
        // No minimum grade specified
        score += 20;
    }
    // Skills match (30 points)
    if (opportunity.requiredSkills && opportunity.requiredSkills.length > 0) {
        const matchedSkills = opportunity.requiredSkills.filter((reqSkill) => skills.some(skill => skill.toLowerCase().includes(reqSkill.toLowerCase())));
        const skillMatchPercentage = matchedSkills.length / opportunity.requiredSkills.length;
        score += skillMatchPercentage * 30;
    }
    else {
        // No skills specified
        score += 15;
    }
    return Math.round(score);
};
// ─────────────────────────────────────────────────────────────
// GENERATE MATCH REASONS
// ─────────────────────────────────────────────────────────────
const generateMatchReasons = (studentGradeLevel, averageScore, overallGrade, skills, opportunity) => {
    const reasons = [];
    // Grade level match
    if (opportunity.gradeLevel && opportunity.gradeLevel.includes(studentGradeLevel)) {
        reasons.push(`Matches your grade level (${studentGradeLevel})`);
    }
    // Academic performance
    if (opportunity.minGrade) {
        const minGradeValue = parseGradeToScore(opportunity.minGrade);
        const studentGradeValue = averageScore || parseGradeToScore(overallGrade);
        if (studentGradeValue >= minGradeValue) {
            reasons.push(`You meet the minimum grade requirement (${opportunity.minGrade})`);
        }
    }
    // Skills match
    if (opportunity.requiredSkills && opportunity.requiredSkills.length > 0) {
        const matchedSkills = opportunity.requiredSkills.filter((reqSkill) => skills.some(skill => skill.toLowerCase().includes(reqSkill.toLowerCase())));
        if (matchedSkills.length > 0) {
            reasons.push(`You have ${matchedSkills.length} of ${opportunity.requiredSkills.length} required skills`);
        }
    }
    // Location match
    if (opportunity.location) {
        reasons.push(`Location: ${opportunity.location}`);
    }
    // Deadline
    if (opportunity.deadline) {
        const daysUntilDeadline = Math.ceil((opportunity.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDeadline > 0) {
            reasons.push(`${daysUntilDeadline} days until deadline`);
        }
    }
    return reasons;
};
// ─────────────────────────────────────────────────────────────
// EXTRACT SKILLS FROM PROGRESS
// ─────────────────────────────────────────────────────────────
const extractSkillsFromProgress = (progress) => {
    const skills = new Set();
    // Add English skills based on completed modules
    if (progress.length > 0) {
        skills.add('English');
    }
    // Add digital literacy if student has completed digital literacy modules
    const hasDigitalLiteracy = progress.some((p) => p.module?.type === 'DIGITAL_LITERACY');
    if (hasDigitalLiteracy) {
        skills.add('Computer Literacy');
        skills.add('Digital Skills');
    }
    // Add communication skills
    const hasCommunicationModules = progress.some((p) => ['SPEAKING', 'WRITING', 'LISTENING'].includes(p.module?.type));
    if (hasCommunicationModules) {
        skills.add('Communication');
    }
    return Array.from(skills);
};
// ─────────────────────────────────────────────────────────────
// PARSE GRADE TO NUMERIC SCORE
// ─────────────────────────────────────────────────────────────
const parseGradeToScore = (grade) => {
    if (!grade)
        return 0;
    // Handle percentage grades (e.g., "75%")
    if (grade.includes('%')) {
        return parseFloat(grade.replace('%', ''));
    }
    // Handle letter grades
    const gradeMap = {
        'A+': 95, 'A': 90, 'A-': 85,
        'B+': 82, 'B': 78, 'B-': 75,
        'C+': 72, 'C': 68, 'C-': 65,
        'D+': 62, 'D': 58, 'D-': 55,
        'F': 40
    };
    return gradeMap[grade.toUpperCase()] || 0;
};
// ─────────────────────────────────────────────────────────────
// GET TOP PERFORMERS FOR OPPORTUNITY
// ─────────────────────────────────────────────────────────────
const getTopPerformersForOpportunity = async (opportunityId, limit = 10) => {
    const opportunity = await database_1.default.opportunity.findUnique({
        where: { id: opportunityId }
    });
    if (!opportunity) {
        throw new Error('Opportunity not found');
    }
    // Get all students matching grade level
    const whereClause = {};
    if (opportunity.gradeLevel && opportunity.gradeLevel.length > 0) {
        whereClause.gradeLevel = { in: opportunity.gradeLevel };
    }
    const students = await database_1.default.studentProfile.findMany({
        where: whereClause,
        include: {
            academicReports: {
                orderBy: { year: 'desc' },
                take: 1
            },
            progress: {
                where: { score: { not: null } },
                select: { score: true }
            }
        }
    });
    // Calculate match scores for all students
    const matchedStudents = students.map(student => {
        const progressScores = student.progress.map((p) => p.score).filter((s) => s !== null);
        const averageScore = progressScores.length > 0
            ? progressScores.reduce((a, b) => a + b, 0) / progressScores.length
            : 0;
        const latestReport = student.academicReports[0];
        const overallGrade = latestReport?.overallGrade || '';
        const skills = extractSkillsFromProgress(student.progress);
        const matchScore = calculateMatchScore(student.gradeLevel, averageScore, overallGrade, skills, opportunity);
        return {
            id: student.id,
            fullName: student.fullName,
            gradeLevel: student.gradeLevel,
            averageScore: parseFloat(averageScore.toFixed(1)),
            overallGrade,
            matchScore,
            matchReasons: generateMatchReasons(student.gradeLevel, averageScore, overallGrade, skills, opportunity)
        };
    });
    // Sort by match score and return top performers
    matchedStudents.sort((a, b) => b.matchScore - a.matchScore);
    return {
        opportunity: {
            id: opportunity.id,
            title: opportunity.title,
            organization: opportunity.organization,
            type: opportunity.type
        },
        topPerformers: matchedStudents.slice(0, limit),
        totalMatched: matchedStudents.filter((s) => s.matchScore > 50).length
    };
};
exports.getTopPerformersForOpportunity = getTopPerformersForOpportunity;
// ─────────────────────────────────────────────────────────────
// RECOMMEND OPPORTUNITIES BY TYPE
// ─────────────────────────────────────────────────────────────
const recommendOpportunitiesByType = async (studentId, type) => {
    const allMatches = await (0, exports.matchOpportunitiesForStudent)(studentId);
    const filteredOpportunities = allMatches.opportunities.filter((opp) => opp.type === type);
    return {
        student: allMatches.student,
        opportunities: filteredOpportunities,
        totalMatches: filteredOpportunities.length
    };
};
exports.recommendOpportunitiesByType = recommendOpportunitiesByType;
//# sourceMappingURL=opportunityMatching.service.js.map