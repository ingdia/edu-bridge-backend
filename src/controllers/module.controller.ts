// src/controllers/module.controller.ts
import type { Request, Response } from 'express';
import { getActiveModules } from '../services/module.service';
import { listModulesQuerySchema } from '../validators/module.validator';

export const listModules = async (req: Request, res: Response) => {
  try {
    // Validate query params
    const query = listModulesQuerySchema.parse(req.query);

    const requesterId = (req as any).user?.id; 
    const ipAddress = req.ip;

    const result = await getActiveModules(query, requesterId, ipAddress);

    res.status(200).json({
      success: true,
      data: result.data,
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