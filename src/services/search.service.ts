// src/services/search.service.ts
import prisma from '../config/database';

// ─────────────────────────────────────────────────────────────
// SEARCH STUDENTS
// ─────────────────────────────────────────────────────────────

export const searchStudents = async (query: string, filters?: {
  gradeLevel?: string;
  district?: string;
  limit?: number;
}) => {
  const whereClause: any = {
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

  const students = await prisma.studentProfile.findMany({
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

// ─────────────────────────────────────────────────────────────
// SEARCH MODULES
// ─────────────────────────────────────────────────────────────

export const searchModules = async (query: string, filters?: {
  type?: string;
  difficulty?: string;
  isActive?: boolean;
  limit?: number;
}) => {
  const whereClause: any = {
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

  const modules = await prisma.learningModule.findMany({
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

// ─────────────────────────────────────────────────────────────
// SEARCH OPPORTUNITIES
// ─────────────────────────────────────────────────────────────

export const searchOpportunities = async (query: string, filters?: {
  type?: string;
  gradeLevel?: string;
  location?: string;
  isActive?: boolean;
  limit?: number;
}) => {
  const whereClause: any = {
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

  const opportunities = await prisma.opportunity.findMany({
    where: whereClause,
    take: filters?.limit || 20,
    orderBy: { createdAt: 'desc' },
  });

  return opportunities;
};

// ─────────────────────────────────────────────────────────────
// GLOBAL SEARCH (ALL ENTITIES)
// ─────────────────────────────────────────────────────────────

export const globalSearch = async (query: string, limit: number = 10) => {
  const [students, modules, opportunities] = await Promise.all([
    searchStudents(query, { limit }),
    searchModules(query, { limit }),
    searchOpportunities(query, { limit }),
  ]);

  return {
    students,
    modules,
    opportunities,
    total: students.length + modules.length + opportunities.length,
  };
};
