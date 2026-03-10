// src/services/module.service.ts
import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import type { ListModulesQuery } from '../validators/module.validator';
// ✅ SINGLE SOURCE: Import ExerciseType for type-safe where clauses
import { ExerciseType } from '@prisma/client';

export const getActiveModules = async (
  filters: ListModulesQuery,
  requesterId: string,
  ipAddress?: string
) => {
  const { type, difficulty } = filters;
  const limit = filters.limit as number; // Zod validated → safe cast
  const page = filters.page as number;
  
  const skip = (page - 1) * limit;

  // ✅ Type-safe where clause using Prisma's ExerciseType
  const whereClause: {
    isActive: boolean;
    type?: ExerciseType;
    difficulty?: string;
  } = {
    isActive: true,
  };
  
  if (type) whereClause.type = type; // type is already ExerciseType from Zod + Prisma
  if (difficulty) whereClause.difficulty = difficulty;

  const [modules, total] = await Promise.all([
    prisma.learningModule.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        difficulty: true,
        estimatedDuration: true,
        orderIndex: true,
      },
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.learningModule.count({ where: whereClause }),
  ]);

  await logAudit(
    requesterId,
    'MODULE_LIST',
    { filters: { type, difficulty }, resultsCount: modules.length },
    ipAddress
  );

  return {
      data: modules,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};