"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModulesForStudent = exports.getModulesForMentor = exports.toggleModuleStatus = exports.deleteModule = exports.updateModule = exports.listModules = exports.getModuleById = exports.createModule = void 0;
// src/services/module.service.ts
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
// ─────────────────────────────────────────────────────────────
// CREATE MODULE (ADMIN ONLY - FR 3)
// ─────────────────────────────────────────────────────────────
const createModule = async (data, adminId, ipAddress) => {
    const module = await database_1.default.learningModule.create({
        data: {
            ...data,
            contentUrl: data.contentUrl.trim(),
            title: data.title.trim(),
        },
    });
    await (0, logger_1.logAudit)(adminId, 'MODULE_CREATE', { moduleId: module.id, title: module.title, type: module.type }, ipAddress);
    return {
        data: { module },
        message: 'Learning module created successfully',
    };
};
exports.createModule = createModule;
// ─────────────────────────────────────────────────────────────
// GET MODULE BY ID (RBAC: Admin/Mentor/Student)
// ─────────────────────────────────────────────────────────────
const getModuleById = async (moduleId, userRole, userId, mentorId) => {
    const module = await database_1.default.learningModule.findUnique({
        where: { id: moduleId },
        select: {
            id: true,
            title: true,
            description: true,
            type: true,
            contentUrl: true,
            difficulty: true,
            estimatedDuration: true,
            orderIndex: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!module) {
        throw new Error('Module not found');
    }
    // NFR 10: Only active modules visible to students/mentors
    if (userRole !== client_1.Role.ADMIN && !module.isActive) {
        throw new Error('Module not available');
    }
    // Optional: Log module view for students/mentors
    if (userId && userRole !== client_1.Role.ADMIN) {
        await (0, logger_1.logAudit)(userId, 'MODULE_VIEW', { moduleId, moduleType: module.type, difficulty: module.difficulty });
    }
    return {
        data: { module },
    };
};
exports.getModuleById = getModuleById;
// ─────────────────────────────────────────────────────────────
// LIST MODULES (RBAC: Filtered by role)
// ─────────────────────────────────────────────────────────────
const listModules = async (filters, userRole, userId, mentorId, ipAddress) => {
    const { type, difficulty, isActive, search, limit, page, sortBy, sortOrder } = filters;
    const skip = (page - 1) * limit;
    // Build where clause
    const whereClause = {
        // Students/mentors only see active modules by default
        isActive: userRole === client_1.Role.ADMIN ? isActive : true,
        ...(type && { type }),
        ...(difficulty && { difficulty }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
        }),
    };
    // Build order clause
    const orderBy = { [sortBy]: sortOrder };
    const [modules, total] = await Promise.all([
        database_1.default.learningModule.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                difficulty: true,
                estimatedDuration: true,
                orderIndex: true,
                isActive: true,
                createdAt: true,
            },
            orderBy,
            skip,
            take: limit,
        }),
        database_1.default.learningModule.count({ where: whereClause }),
    ]);
    // Audit logging for listing action
    if (userId) {
        await (0, logger_1.logAudit)(userId, 'MODULE_LIST', { filters: { type, difficulty, search }, resultsCount: modules.length, userRole }, ipAddress);
    }
    return {
        data: { modules },
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.listModules = listModules;
// ─────────────────────────────────────────────────────────────
// UPDATE MODULE (ADMIN ONLY - FR 3)
// ─────────────────────────────────────────────────────────────
const updateModule = async (moduleId, data, adminId, ipAddress) => {
    // Verify module exists
    const existing = await database_1.default.learningModule.findUnique({
        where: { id: moduleId },
        select: { id: true, title: true },
    });
    if (!existing) {
        throw new Error('Module not found');
    }
    // Clean and filter undefined values
    const updateData = {};
    if (data.title !== undefined)
        updateData.title = data.title.trim();
    if (data.description !== undefined)
        updateData.description = data.description?.trim() || null;
    if (data.type !== undefined)
        updateData.type = data.type;
    if (data.contentUrl !== undefined)
        updateData.contentUrl = data.contentUrl.trim();
    if (data.difficulty !== undefined)
        updateData.difficulty = data.difficulty;
    if (data.estimatedDuration !== undefined)
        updateData.estimatedDuration = data.estimatedDuration;
    if (data.orderIndex !== undefined)
        updateData.orderIndex = data.orderIndex;
    if (data.isActive !== undefined)
        updateData.isActive = data.isActive;
    const updatedModule = await database_1.default.learningModule.update({
        where: { id: moduleId },
        data: updateData,
    });
    await (0, logger_1.logAudit)(adminId, 'MODULE_UPDATE', {
        moduleId,
        previousTitle: existing.title,
        updatedFields: Object.keys(updateData)
    }, ipAddress);
    return {
        data: { updatedModule },
        message: 'Module updated successfully',
    };
};
exports.updateModule = updateModule;
// ─────────────────────────────────────────────────────────────
// DELETE/DEACTIVATE MODULE (ADMIN ONLY - FR 3)
// ─────────────────────────────────────────────────────────────
const deleteModule = async (moduleId, adminId, ipAddress, hardDelete = false // Soft delete by default
) => {
    const existing = await database_1.default.learningModule.findUnique({
        where: { id: moduleId },
        select: { id: true, title: true, isActive: true },
    });
    if (!existing) {
        throw new Error('Module not found');
    }
    let result;
    if (hardDelete) {
        // ⚠️ Hard delete: Only use if absolutely necessary (data loss!)
        result = await database_1.default.learningModule.delete({
            where: { id: moduleId },
        });
    }
    else {
        // ✅ Soft delete: Set isActive = false (recommended)
        result = await database_1.default.learningModule.update({
            where: { id: moduleId },
            data: { isActive: false },
        });
    }
    await (0, logger_1.logAudit)(adminId, 'MODULE_DELETE', {
        moduleId,
        title: existing.title,
        action: hardDelete ? 'hard_delete' : 'soft_deactivate'
    }, ipAddress);
    return {
        data: { result },
        message: hardDelete ? 'Module permanently deleted' : 'Module deactivated',
    };
};
exports.deleteModule = deleteModule;
// ─────────────────────────────────────────────────────────────
// TOGGLE MODULE STATUS (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
const toggleModuleStatus = async (moduleId, adminId, ipAddress) => {
    const module = await database_1.default.learningModule.findUnique({
        where: { id: moduleId },
        select: { id: true, title: true, isActive: true },
    });
    if (!module) {
        throw new Error('Module not found');
    }
    const updated = await database_1.default.learningModule.update({
        where: { id: moduleId },
        data: { isActive: !module.isActive },
    });
    await (0, logger_1.logAudit)(adminId, 'MODULE_STATUS_TOGGLE', {
        moduleId,
        title: module.title,
        previousStatus: module.isActive,
        newStatus: updated.isActive
    }, ipAddress);
    return {
        data: { updated },
        message: `Module ${updated.isActive ? 'activated' : 'deactivated'}`,
    };
};
exports.toggleModuleStatus = toggleModuleStatus;
// ─────────────────────────────────────────────────────────────
// GET MODULES FOR MENTOR (Assigned Students Only - FR 7)
// ─────────────────────────────────────────────────────────────
const getModulesForMentor = async (mentorUserId, filters, ipAddress) => {
    // Get mentor profile
    const mentor = await database_1.default.mentorProfile.findUnique({
        where: { userId: mentorUserId },
        select: { id: true, assignedStudents: { select: { id: true } } },
    });
    if (!mentor) {
        throw new Error('Mentor profile not found');
    }
    const studentIds = mentor.assignedStudents.map(s => s.id);
    // Get modules that assigned students have progress on OR all active modules
    const whereClause = {
        isActive: true,
        ...(filters?.type && { type: filters.type }),
        ...(filters?.difficulty && { difficulty: filters.difficulty }),
    };
    const modules = await database_1.default.learningModule.findMany({
        where: whereClause,
        select: {
            id: true,
            title: true,
            description: true,
            type: true,
            difficulty: true,
            estimatedDuration: true,
            orderIndex: true,
            isActive: true,
        },
        orderBy: { orderIndex: 'asc' },
    });
    await (0, logger_1.logAudit)(mentorUserId, 'MODULE_LIST', { filters, resultsCount: modules.length, role: 'MENTOR' }, ipAddress);
    return {
        data: { modules },
    };
};
exports.getModulesForMentor = getModulesForMentor;
// ─────────────────────────────────────────────────────────────
// GET MODULES FOR STUDENT (Available Modules - FR 3-4)
// ─────────────────────────────────────────────────────────────
const getModulesForStudent = async (studentUserId, filters, ipAddress) => {
    // Get student profile
    const student = await database_1.default.studentProfile.findUnique({
        where: { userId: studentUserId },
        select: { id: true },
    });
    if (!student) {
        throw new Error('Student profile not found');
    }
    const whereClause = {
        isActive: true,
        ...(filters?.type && { type: filters.type }),
        ...(filters?.difficulty && { difficulty: filters.difficulty }),
    };
    const modules = await database_1.default.learningModule.findMany({
        where: whereClause,
        select: {
            id: true,
            title: true,
            description: true,
            type: true,
            difficulty: true,
            estimatedDuration: true,
            orderIndex: true,
            // Include this student's progress if any
            progress: {
                where: { studentId: student.id },
                select: { id: true, score: true, completedAt: true, timeSpent: true },
            },
        },
        orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
    });
    // Transform to include personal progress
    const modulesWithProgress = modules.map(mod => {
        const myProgress = mod.progress[0];
        return {
            id: mod.id,
            title: mod.title,
            description: mod.description,
            type: mod.type,
            difficulty: mod.difficulty,
            estimatedDuration: mod.estimatedDuration,
            orderIndex: mod.orderIndex,
            progress: myProgress ? {
                score: myProgress.score,
                completedAt: myProgress.completedAt,
                timeSpent: myProgress.timeSpent,
                isCompleted: !!myProgress.completedAt,
            } : null,
        };
    });
    await (0, logger_1.logAudit)(studentUserId, 'MODULE_LIST', { context: 'student_dashboard', resultsCount: modulesWithProgress.length }, ipAddress);
    return {
        data: { modulesWithProgress },
    };
};
exports.getModulesForStudent = getModulesForStudent;
//# sourceMappingURL=module.service.js.map