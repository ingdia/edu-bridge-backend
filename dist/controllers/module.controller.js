"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModulesForStudentHandler = exports.getModulesForMentorHandler = exports.toggleModuleStatusHandler = exports.deleteModuleHandler = exports.updateModuleHandler = exports.listModulesHandler = exports.getModuleHandler = exports.createModuleHandler = void 0;
const client_1 = require("@prisma/client");
const module_service_1 = require("../services/module.service");
const module_validator_1 = require("../validators/module.validator");
// ─────────────────────────────────────────────────────────────
// CREATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
const createModuleHandler = async (req, res) => {
    try {
        const body = module_validator_1.createModuleSchema.parse(req.body);
        const adminId = req.user?.userId;
        const ipAddress = req.ip;
        if (!adminId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const result = await (0, module_service_1.createModule)(body, adminId, ipAddress);
        res.status(201).json({
            success: true,
            data: result.data,
            message: result.message,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid module data',
                errors: error.errors,
            });
        }
        console.error('[MODULE_CREATE_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create learning module',
        });
    }
};
exports.createModuleHandler = createModuleHandler;
// ─────────────────────────────────────────────────────────────
// GET SINGLE MODULE (RBAC)
// ─────────────────────────────────────────────────────────────
const getModuleHandler = async (req, res) => {
    try {
        const { id } = module_validator_1.moduleParamsSchema.parse(req.params);
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const result = await (0, module_service_1.getModuleById)(id, user.role, user.userId, user.role === client_1.Role.MENTOR ? user.userId : undefined);
        res.status(200).json({
            success: true,
            data: result.data,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid module ID',
                errors: error.errors,
            });
        }
        if (error.message === 'Module not found' || error.message === 'Module not available') {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error('[MODULE_GET_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch module details',
        });
    }
};
exports.getModuleHandler = getModuleHandler;
// ─────────────────────────────────────────────────────────────
// LIST MODULES (RBAC)
// ─────────────────────────────────────────────────────────────
const listModulesHandler = async (req, res) => {
    try {
        const query = module_validator_1.listModulesQuerySchema.parse(req.query);
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const result = await (0, module_service_1.listModules)(query, user.role, user.userId, user.role === client_1.Role.MENTOR ? user.userId : undefined, req.ip);
        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid query parameters',
                errors: error.errors,
            });
        }
        console.error('[MODULE_LIST_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch learning modules',
        });
    }
};
exports.listModulesHandler = listModulesHandler;
// ─────────────────────────────────────────────────────────────
// UPDATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
const updateModuleHandler = async (req, res) => {
    try {
        const { id } = module_validator_1.moduleParamsSchema.parse(req.params);
        const body = module_validator_1.updateModuleSchema.parse(req.body);
        const adminId = req.user?.userId;
        const ipAddress = req.ip;
        if (!adminId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const result = await (0, module_service_1.updateModule)(id, body, adminId, ipAddress);
        res.status(200).json({
            success: true,
            data: result.data,
            message: result.message,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid update data',
                errors: error.errors,
            });
        }
        if (error.message === 'Module not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error('[MODULE_UPDATE_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update learning module',
        });
    }
};
exports.updateModuleHandler = updateModuleHandler;
// ─────────────────────────────────────────────────────────────
// DELETE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
const deleteModuleHandler = async (req, res) => {
    try {
        const { id } = module_validator_1.moduleParamsSchema.parse(req.params);
        const adminId = req.user?.userId;
        const ipAddress = req.ip;
        const hardDelete = req.query.hard === 'true';
        if (!adminId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const result = await (0, module_service_1.deleteModule)(id, adminId, ipAddress, hardDelete);
        res.status(200).json({
            success: true,
            data: result.data,
            message: result.message,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid module ID',
                errors: error.errors,
            });
        }
        if (error.message === 'Module not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error('[MODULE_DELETE_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete learning module',
        });
    }
};
exports.deleteModuleHandler = deleteModuleHandler;
// ─────────────────────────────────────────────────────────────
// TOGGLE MODULE STATUS (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
const toggleModuleStatusHandler = async (req, res) => {
    try {
        const { id } = module_validator_1.moduleParamsSchema.parse(req.params);
        const adminId = req.user?.userId;
        const ipAddress = req.ip;
        if (!adminId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const result = await (0, module_service_1.toggleModuleStatus)(id, adminId, ipAddress);
        res.status(200).json({
            success: true,
            data: result.data,
            message: result.message,
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid module ID',
                errors: error.errors,
            });
        }
        if (error.message === 'Module not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error('[MODULE_TOGGLE_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle module status',
        });
    }
};
exports.toggleModuleStatusHandler = toggleModuleStatusHandler;
// ─────────────────────────────────────────────────────────────
// GET MODULES FOR MENTOR (MENTOR ONLY)
// ─────────────────────────────────────────────────────────────
const getModulesForMentorHandler = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== client_1.Role.MENTOR) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Mentors only'
            });
        }
        // Parse optional filters from query
        const filters = {};
        if (req.query.type)
            filters.type = req.query.type;
        if (req.query.difficulty)
            filters.difficulty = req.query.difficulty;
        const result = await (0, module_service_1.getModulesForMentor)(user.userId, filters, req.ip);
        res.status(200).json({
            success: true,
            data: result.data,
        });
    }
    catch (error) {
        if (error.message === 'Mentor profile not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error('[MENTOR_MODULES_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assigned modules',
        });
    }
};
exports.getModulesForMentorHandler = getModulesForMentorHandler;
// ─────────────────────────────────────────────────────────────
// GET MODULES FOR STUDENT (STUDENT ONLY)
// ─────────────────────────────────────────────────────────────
const getModulesForStudentHandler = async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== client_1.Role.STUDENT) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Students only'
            });
        }
        // Parse optional filters from query
        const filters = {};
        if (req.query.type)
            filters.type = req.query.type;
        if (req.query.difficulty)
            filters.difficulty = req.query.difficulty;
        const result = await (0, module_service_1.getModulesForStudent)(user.userId, filters, req.ip);
        res.status(200).json({
            success: true,
            data: result.data,
        });
    }
    catch (error) {
        if (error.message === 'Student profile not found') {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error('[STUDENT_MODULES_ERROR]', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available modules',
        });
    }
};
exports.getModulesForStudentHandler = getModulesForStudentHandler;
//# sourceMappingURL=module.controller.js.map