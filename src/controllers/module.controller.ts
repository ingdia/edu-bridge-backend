// src/controllers/module.controller.ts
import type { Request, Response } from 'express';
import { Role } from '@prisma/client';
import {
  createModule,
  getModuleById,
  listModules,
  updateModule,
  deleteModule,
  toggleModuleStatus,
  getModulesForMentor,
  getModulesForStudent,
} from '../services/module.service';
import {
  createModuleSchema,
  updateModuleSchema,
  listModulesQuerySchema,
  moduleParamsSchema,
} from '../validators/module.validator';

// ─────────────────────────────────────────────────────────────
// CREATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────

export const createModuleHandler = async (req: Request, res: Response) => {
  try {
    const body = createModuleSchema.parse(req.body);
    const adminId = (req as any).user?.userId;
    const ipAddress = req.ip;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await createModule(body, adminId, ipAddress);

    res.status(201).json({
      success: true,
       result.data,
      message: result.message,
    });
  } catch (error: any) {
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

// ─────────────────────────────────────────────────────────────
// GET SINGLE MODULE (RBAC)
// ─────────────────────────────────────────────────────────────

export const getModuleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = moduleParamsSchema.parse(req.params);
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await getModuleById(
      id,
      user.role,
      user.userId,
      user.role === Role.MENTOR ? user.userId : undefined
    );

    res.status(200).json({
      success: true,
       result.data,
    });
  } catch (error: any) {
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

// ─────────────────────────────────────────────────────────────
// LIST MODULES (RBAC)
// ─────────────────────────────────────────────────────────────

export const listModulesHandler = async (req: Request, res: Response) => {
  try {
    const query = listModulesQuerySchema.parse(req.query);
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await listModules(
      query,
      user.role,
      user.userId,
      user.role === Role.MENTOR ? user.userId : undefined,
      req.ip
    );

    res.status(200).json({
      success: true,
       result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
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

// ─────────────────────────────────────────────────────────────
// UPDATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────

export const updateModuleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = moduleParamsSchema.parse(req.params);
    const body = updateModuleSchema.parse(req.body);
    const adminId = (req as any).user?.userId;
    const ipAddress = req.ip;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await updateModule(id, body, adminId, ipAddress);

    res.status(200).json({
      success: true,
       result.data,
      message: result.message,
    });
  } catch (error: any) {
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

// ─────────────────────────────────────────────────────────────
// DELETE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────

export const deleteModuleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = moduleParamsSchema.parse(req.params);
    const adminId = (req as any).user?.userId;
    const ipAddress = req.ip;
    const hardDelete = req.query.hard === 'true';

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await deleteModule(id, adminId, ipAddress, hardDelete);

    res.status(200).json({
      success: true,
       result.data,
      message: result.message,
    });
  } catch (error: any) {
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

// ─────────────────────────────────────────────────────────────
// TOGGLE MODULE STATUS (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────

export const toggleModuleStatusHandler = async (req: Request, res: Response) => {
  try {
    const { id } = moduleParamsSchema.parse(req.params);
    const adminId = (req as any).user?.userId;
    const ipAddress = req.ip;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await toggleModuleStatus(id, adminId, ipAddress);

    res.status(200).json({
      success: true,
       result.data,
      message: result.message,
    });
  } catch (error: any) {
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

// ─────────────────────────────────────────────────────────────
// GET MODULES FOR MENTOR (MENTOR ONLY)
// ─────────────────────────────────────────────────────────────

export const getModulesForMentorHandler = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || user.role !== Role.MENTOR) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Mentors only' 
      });
    }

    // Parse optional filters from query
    const filters: any = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;

    const result = await getModulesForMentor(user.userId, filters, req.ip);

    res.status(200).json({
      success: true,
       result.data,
    });
  } catch (error: any) {
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

// ─────────────────────────────────────────────────────────────
// GET MODULES FOR STUDENT (STUDENT ONLY)
// ─────────────────────────────────────────────────────────────

export const getModulesForStudentHandler = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user || user.role !== Role.STUDENT) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Students only' 
      });
    }

    // Parse optional filters from query
    const filters: any = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;

    const result = await getModulesForStudent(user.userId, filters, req.ip);

    res.status(200).json({
      success: true,
       result.data,
    });
  } catch (error: any) {
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