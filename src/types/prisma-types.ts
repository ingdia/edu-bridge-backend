// Force TypeScript to reload Prisma types
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This file ensures TypeScript recognizes all Prisma models
export type ExerciseSubmissionModel = typeof prisma.exerciseSubmission;
