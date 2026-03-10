// src/validators/module.validator.ts
import { z } from 'zod';
import { ExerciseType } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// PATH PARAMETERS
// ─────────────────────────────────────────────────────────────

export const moduleParamsSchema = z.object({
  id: z.string().uuid('Invalid module ID format'),
});

export type ModuleParams = z.infer<typeof moduleParamsSchema>;

// ─────────────────────────────────────────────────────────────
// CREATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────

export const createModuleSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000).optional(),
  type: z.nativeEnum(ExerciseType),
  contentUrl: z.string().url('Must be a valid URL'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDuration: z.number().int().positive().min(1).max(300).optional(), // in minutes
  orderIndex: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;

// ─────────────────────────────────────────────────────────────
// UPDATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────

export const updateModuleSchema = createModuleSchema.partial();

export type UpdateModuleInput = z.infer<typeof updateModuleSchema>;

// ─────────────────────────────────────────────────────────────
// LIST MODULES QUERY (All roles)
// ─────────────────────────────────────────────────────────────

export const listModulesQuerySchema = z.object({
  type: z.nativeEnum(ExerciseType).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
  sortBy: z.enum(['title', 'difficulty', 'orderIndex', 'createdAt']).default('orderIndex'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type ListModulesQuery = z.infer<typeof listModulesQuerySchema>;