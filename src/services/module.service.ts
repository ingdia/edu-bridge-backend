// src/services/module.service.ts
import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import type { 
  CreateModuleInput, 
  UpdateModuleInput, 
  ListModulesQuery,
  ModuleParams 
} from '../validators/module.validator';
import { Role, ExerciseType } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// CREATE MODULE (ADMIN ONLY - FR 3)
// ─────────────────────────────────────────────────────────────

export const createModule = async (
  data: CreateModuleInput,
  adminId: string,
  ipAddress?: string
) => {
  const module = await prisma.learningModule.create({
    data: {
      ...data,
      contentUrl: data.contentUrl.trim(),
      title: data.title.trim(),
    },
  });

  await logAudit(
    adminId,
    'MODULE_CREATE',
    { moduleId: module.id, title: module.title, type: module.type },
    ipAddress
  );

  return {
    data: { module },
    message: 'Learning module created successfully',
  };
};

// ─────────────────────────────────────────────────────────────
// GET MODULE BY ID (RBAC: Admin/Mentor/Student)
// ─────────────────────────────────────────────────────────────

export const getModuleById = async (
  moduleId: string,
  userRole: Role,
  userId?: string,
  mentorId?: string
) => {
  const module = await prisma.learningModule.findUnique({
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
  if (userRole !== Role.ADMIN && !module.isActive) {
    throw new Error('Module not available');
  }

  // Optional: Log module view for students/mentors
  if (userId && userRole !== Role.ADMIN) {
    await logAudit(
      userId,
      'MODULE_VIEW',
      { moduleId, moduleType: module.type, difficulty: module.difficulty }
    );
  }

  return {
    data: { module },
  };
};

// ─────────────────────────────────────────────────────────────
// LIST MODULES (RBAC: Filtered by role)
// ─────────────────────────────────────────────────────────────

export const listModules = async (
  filters: ListModulesQuery,
  userRole: Role,
  userId?: string,
  mentorId?: string,
  ipAddress?: string
) => {
  const { 
    type, 
    difficulty, 
    isActive, 
    search, 
    limit, 
    page, 
    sortBy, 
    sortOrder 
  } = filters;
  
  const skip = (page - 1) * limit;

  // Build where clause
  const whereClause: any = {
    // Students/mentors only see active modules by default
    isActive: userRole === Role.ADMIN ? isActive : true,
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
  const orderBy: any = { [sortBy]: sortOrder };

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
        isActive: true,
        createdAt: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.learningModule.count({ where: whereClause }),
  ]);

  // Audit logging for listing action
  if (userId) {
    await logAudit(
      userId,
      'MODULE_LIST',
      { filters: { type, difficulty, search }, resultsCount: modules.length, userRole },
      ipAddress
    );
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

// ─────────────────────────────────────────────────────────────
// UPDATE MODULE (ADMIN ONLY - FR 3)
// ─────────────────────────────────────────────────────────────

export const updateModule = async (
  moduleId: string,
  data: UpdateModuleInput,
  adminId: string,
  ipAddress?: string
) => {
  // Verify module exists
  const existing = await prisma.learningModule.findUnique({
    where: { id: moduleId },
    select: { id: true, title: true },
  });

  if (!existing) {
    throw new Error('Module not found');
  }

  // Clean and filter undefined values
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description?.trim() || null;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.contentUrl !== undefined) updateData.contentUrl = data.contentUrl.trim();
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.estimatedDuration !== undefined) updateData.estimatedDuration = data.estimatedDuration;
  if (data.orderIndex !== undefined) updateData.orderIndex = data.orderIndex;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const updatedModule = await prisma.learningModule.update({
    where: { id: moduleId },
    data: updateData,
  });

  await logAudit(
    adminId,
    'MODULE_UPDATE',
    { 
      moduleId, 
      previousTitle: existing.title,
      updatedFields: Object.keys(updateData) 
    },
    ipAddress
  );

  return {
    data: { updatedModule },
    message: 'Module updated successfully',
  };
};

// ─────────────────────────────────────────────────────────────
// DELETE/DEACTIVATE MODULE (ADMIN ONLY - FR 3)
// ─────────────────────────────────────────────────────────────

export const deleteModule = async (
  moduleId: string,
  adminId: string,
  ipAddress?: string,
  hardDelete: boolean = false // Soft delete by default
) => {
  const existing = await prisma.learningModule.findUnique({
    where: { id: moduleId },
    select: { id: true, title: true, isActive: true },
  });

  if (!existing) {
    throw new Error('Module not found');
  }

  let result;
  
  if (hardDelete) {
    // ⚠️ Hard delete: Only use if absolutely necessary (data loss!)
    result = await prisma.learningModule.delete({
      where: { id: moduleId },
    });
  } else {
    // ✅ Soft delete: Set isActive = false (recommended)
    result = await prisma.learningModule.update({
      where: { id: moduleId },
      data: { isActive: false },
    });
  }

  await logAudit(
    adminId,
    'MODULE_DELETE',
    { 
      moduleId, 
      title: existing.title, 
      action: hardDelete ? 'hard_delete' : 'soft_deactivate' 
    },
    ipAddress
  );

  return {
    data: { result },
    message: hardDelete ? 'Module permanently deleted' : 'Module deactivated',
  };
};

// ─────────────────────────────────────────────────────────────
// TOGGLE MODULE STATUS (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────

export const toggleModuleStatus = async (
  moduleId: string,
  adminId: string,
  ipAddress?: string
) => {
  const module = await prisma.learningModule.findUnique({
    where: { id: moduleId },
    select: { id: true, title: true, isActive: true },
  });

  if (!module) {
    throw new Error('Module not found');
  }

  const updated = await prisma.learningModule.update({
    where: { id: moduleId },
    data: { isActive: !module.isActive },
  });

  await logAudit(
    adminId,
    'MODULE_STATUS_TOGGLE',
    { 
      moduleId, 
      title: module.title, 
      previousStatus: module.isActive,
      newStatus: updated.isActive 
    },
    ipAddress
  );

  return {
    data: { updated },
    message: `Module ${updated.isActive ? 'activated' : 'deactivated'}`,
  };
};

// ─────────────────────────────────────────────────────────────
// GET MODULES FOR MENTOR (Assigned Students Only - FR 7)
// ─────────────────────────────────────────────────────────────

export const getModulesForMentor = async (
  mentorUserId: string,
  filters?: { type?: ExerciseType; difficulty?: string },
  ipAddress?: string
) => {
  let mentor = await prisma.mentorProfile.findUnique({
    where: { userId: mentorUserId },
    select: { id: true, assignedModules: { select: { moduleId: true } } },
  });

  if (!mentor) {
    mentor = await prisma.mentorProfile.create({
      data: { userId: mentorUserId, expertise: [] },
      select: { id: true, assignedModules: { select: { moduleId: true } } },
    });
  }

  const assignedModuleIds = mentor.assignedModules.map((m) => m.moduleId);

  const whereClause: any = {
    isActive: true,
    // If admin has assigned specific modules, filter to those only
    ...(assignedModuleIds.length > 0 ? { id: { in: assignedModuleIds } } : {}),
    ...(filters?.type && { type: filters.type }),
    ...(filters?.difficulty && { difficulty: filters.difficulty }),
  };

  const modules = await prisma.learningModule.findMany({
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

  await logAudit(
    mentorUserId,
    'MODULE_LIST',
    { filters, resultsCount: modules.length, role: 'MENTOR', assignedOnly: assignedModuleIds.length > 0 },
    ipAddress
  );

  return { data: { modules } };
};

// ─────────────────────────────────────────────────────────────
// GET MODULES FOR STUDENT (Available Modules - FR 3-4)
// ─────────────────────────────────────────────────────────────

export const getModulesForStudent = async (
  studentUserId: string,
  filters?: { type?: ExerciseType; difficulty?: string },
  ipAddress?: string
) => {
  // Get student profile
  const student = await prisma.studentProfile.findUnique({
    where: { userId: studentUserId },
    select: { id: true },
  });

  if (!student) {
    throw new Error('Student profile not found');
  }

  const whereClause: any = {
    isActive: true,
    ...(filters?.type && { type: filters.type }),
    ...(filters?.difficulty && { difficulty: filters.difficulty }),
  };

  const modules = await prisma.learningModule.findMany({
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

  await logAudit(
    studentUserId,
    'MODULE_LIST',
    { context: 'student_dashboard', resultsCount: modulesWithProgress.length },
    ipAddress
  );

  return {
    data: { modulesWithProgress },
  };
};