// src/validators/module.validator.ts
import { z } from 'zod';
// ✅ SINGLE SOURCE: Import ExerciseType from Prisma client
import { ExerciseType as PrismaExerciseType } from '@prisma/client';

export const listModulesQuerySchema = z.object({
  // ✅ Use nativeEnum to validate against Prisma's ExerciseType
  type: z.nativeEnum(PrismaExerciseType).optional(),
  difficulty: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export type ListModulesQuery = z.infer<typeof listModulesQuerySchema>;