"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSearch = exports.searchOpportunities = exports.searchModules = exports.searchStudents = void 0;
// src/services/search.service.ts
const database_1 = __importDefault(require("../config/database"));
// ─────────────────────────────────────────────────────────────
// SEARCH STUDENTS
// ─────────────────────────────────────────────────────────────
const searchStudents = async (query, filters) => {
    const whereClause = {
        OR: [
            { fullName: { contains: query, mode: 'insensitive' } },
            { nationalId: { contains: query, mode: 'insensitive' } },
            { user: { email: { contains: query, mode: 'insensitive' } } },
        ],
    };
    if (filters?.gradeLevel) {
        whereClause.gradeLevel = filters.gradeLevel;
    }
    if (filters?.district) {
        whereClause.district = filters.district;
    }
    const students = await database_1.default.studentProfile.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    email: true,
                    isActive: true,
                    lastLogin: true,
                },
            },
        },
        take: filters?.limit || 20,
        orderBy: { fullName: 'asc' },
    });
    return students.map((student) => ({
        id: student.id,
        userId: student.userId,
        fullName: student.fullName,
        email: student.user.email,
        nationalId: student.nationalId,
        schoolName: student.schoolName,
        gradeLevel: student.gradeLevel,
        district: student.district,
        isActive: student.user.isActive,
        lastLogin: student.user.lastLogin,
    }));
};
exports.searchStudents = searchStudents;
// ─────────────────────────────────────────────────────────────
// SEARCH MODULES
// ─────────────────────────────────────────────────────────────
const searchModules = async (query, filters) => {
    const whereClause = {
        OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
        ],
    };
    if (filters?.type) {
        whereClause.type = filters.type;
    }
    if (filters?.difficulty) {
        whereClause.difficulty = filters.difficulty;
    }
    if (filters?.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
    }
    const modules = await database_1.default.learningModule.findMany({
        where: whereClause,
        include: {
            _count: {
                select: {
                    progress: true,
                    exerciseSubmissions: true,
                },
            },
        },
        take: filters?.limit || 20,
        orderBy: { orderIndex: 'asc' },
    });
    return modules.map((module) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        type: module.type,
        difficulty: module.difficulty,
        isActive: module.isActive,
        totalAttempts: module._count.progress,
        totalSubmissions: module._count.exerciseSubmissions,
    }));
};
exports.searchModules = searchModules;
// ─────────────────────────────────────────────────────────────
// SEARCH OPPORTUNITIES
// ─────────────────────────────────────────────────────────────
const searchOpportunities = async (query, filters) => {
    const whereClause = {
        OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { organization: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
        ],
    };
    if (filters?.type) {
        whereClause.type = filters.type;
    }
    if (filters?.gradeLevel) {
        whereClause.gradeLevel = { has: filters.gradeLevel };
    }
    if (filters?.location) {
        whereClause.location = { contains: filters.location, mode: 'insensitive' };
    }
    if (filters?.isActive !== undefined) {
        whereClause.isActive = filters.isActive;
    }
    const opportunities = await database_1.default.opportunity.findMany({
        where: whereClause,
        take: filters?.limit || 20,
        orderBy: { createdAt: 'desc' },
    });
    return opportunities;
};
exports.searchOpportunities = searchOpportunities;
// ─────────────────────────────────────────────────────────────
// GLOBAL SEARCH (ALL ENTITIES)
// ─────────────────────────────────────────────────────────────
const globalSearch = async (query, limit = 10) => {
    const [students, modules, opportunities] = await Promise.all([
        (0, exports.searchStudents)(query, { limit }),
        (0, exports.searchModules)(query, { limit }),
        (0, exports.searchOpportunities)(query, { limit }),
    ]);
    return {
        students,
        modules,
        opportunities,
        total: students.length + modules.length + opportunities.length,
    };
};
exports.globalSearch = globalSearch;
//# sourceMappingURL=search.service.js.map