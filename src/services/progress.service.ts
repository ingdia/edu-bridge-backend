import { Progress, SessionStatus } from '@prisma/client';
import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { SubmitProgressInput, MentorDashboardFilters } from '../validators/progress.validator';

// Helper: Compute status from completedAt (since schema has no status field)
const computeStatus = (completedAt: Date | null): 'completed' | 'in_progress' => {
  return completedAt ? 'completed' : 'in_progress';
};

export class ProgressService {
  /**
   * Submit or update progress for a student on a module
   */
  static async submitProgress(
    studentId: string,
    data: SubmitProgressInput
  ): Promise<{ data: Progress; message: string }> {
    const { moduleId, score, timeSpent, completedAt, feedback } = data;

    // Check if module exists and is active (schema uses isActive, not isPublished)
    const module = await prisma.learningModule.findUnique({
      where: { id: moduleId },
    });
    if (!module) {
      throw new Error('Module not found');
    }
    if (!module.isActive) {
      throw new Error('Cannot submit progress for inactive module');
    }

    // Check if student profile exists
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
    });
    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    // Upsert progress record (uses schema fields only)
    const progress = await prisma.progress.upsert({
      where: {
        studentId_moduleId: {
          studentId: studentProfile.id,
          moduleId,
        },
      },
      update: {
        score: score ?? undefined,
        timeSpent: timeSpent ?? undefined,
        completedAt: completedAt ?? undefined,
        feedback: feedback ?? undefined,
        lastSyncedAt: new Date(),
      },
      create: {
        studentId: studentProfile.id,
        moduleId,
        score: score ?? 0,
        timeSpent: timeSpent ?? 0,
        completedAt: completedAt ?? null,
        feedback: feedback ?? '',
        isSynced: true,
        lastSyncedAt: new Date(),
      },
    });

    await logAudit(
      studentId,
      'PROGRESS_SUBMIT',
      { 
        progressId: progress.id,
        moduleId, 
        score, 
        completed: completedAt ? true : false,
        timeSpent 
      }
    );

    return { data: progress, message: 'Progress submitted successfully' };
  }

  /**
   * Get student's own progress dashboard
   */
  static async getStudentDashboard(
    studentId: string,
    filters?: { moduleId?: string; isCompleted?: boolean }
  ): Promise<{ data: { progress: any[]; summary: any }; message: string }> {
    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
      select: { id: true },
    });
    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const where: any = { studentId: studentProfile.id };
    if (filters?.moduleId) where.moduleId = filters.moduleId;
    
    // Filter by completion status (computed from completedAt)
    if (filters?.isCompleted !== undefined) {
      if (filters.isCompleted) {
        where.completedAt = { not: null };
      } else {
        where.completedAt = null;
      }
    }

    const progress = await prisma.progress.findMany({
      where,
      include: {
        module: {
          select: {
            id: true,
            title: true,
            type: true, // ExerciseType enum
            difficulty: true,
            estimatedDuration: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' }, // Use schema's updatedAt
    });

    // Enrich with computed status
    const enrichedProgress = progress.map(p => ({
      ...p,
      status: computeStatus(p.completedAt), // Computed field for frontend
    }));

    // Calculate summary statistics
    const completedCount = enrichedProgress.filter((p) => p.status === 'completed').length;
    const inProgressCount = enrichedProgress.filter((p) => p.status === 'in_progress').length;
    const scoredProgress = enrichedProgress.filter((p) => p.score !== null);
    
    const summary = {
      totalModules: enrichedProgress.length,
      completed: completedCount,
      inProgress: inProgressCount,
      completionRate: enrichedProgress.length > 0 
        ? Math.round((completedCount / enrichedProgress.length) * 100) 
        : 0,
      averageScore: scoredProgress.length > 0
        ? parseFloat((
            scoredProgress.reduce((acc, p) => acc + (p.score ?? 0), 0) / scoredProgress.length
          ).toFixed(1))
        : null,
      totalTimeSpent: enrichedProgress.reduce((acc, p) => acc + (p.timeSpent ?? 0), 0),
    };

    return {
      data: { progress: enrichedProgress, summary },
      message: 'Student dashboard retrieved successfully',
    };
  }

  /**
   * Get mentor dashboard: progress of assigned students
   */
  static async getMentorDashboard(
    mentorUserId: string,
    filters: MentorDashboardFilters
  ): Promise<{ data: { students: any[]; summary: any }; message: string }> {
    // Get mentor profile first
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
      select: { id: true },
    });
    if (!mentorProfile) {
      throw new Error('Mentor profile not found');
    }

    // Get students assigned to this mentor via active sessions
    const mentorshipSessions = await prisma.mentorshipSession.findMany({
      where: { 
        mentorId: mentorProfile.id, 
        status: { in: [SessionStatus.SCHEDULED, SessionStatus.COMPLETED] } 
      },
      select: { studentId: true },
    });

    const studentIds = mentorshipSessions.map((s) => s.studentId);
    if (studentIds.length === 0) {
      return { data: { students: [], summary: {} }, message: 'No assigned students found' };
    }

    // Build query filters
    const where: any = {
      studentId: { in: studentIds },
    };
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.moduleId) where.moduleId = filters.moduleId;
    if (filters.isCompleted !== undefined) {
      where.completedAt = filters.isCompleted ? { not: null } : null;
    }

    const progress = await prisma.progress.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      orderBy: { [filters.sortBy]: filters.sortOrder },
    });

    // Group by student for dashboard view
    const studentsMap = new Map();
    for (const p of progress) {
      if (!studentsMap.has(p.studentId)) {
        studentsMap.set(p.studentId, {
          student: p.student,
          progress: [],
          stats: {
            completed: 0,
            inProgress: 0,
            avgScore: 0,
            totalTime: 0,
          },
        });
      }
      const studentData = studentsMap.get(p.studentId);
      const status = computeStatus(p.completedAt);
      studentData.progress.push({ ...p, status }); // Add computed status
      if (status === 'completed') studentData.stats.completed++;
      else studentData.stats.inProgress++;
      if (p.score !== null) {
        const count = studentData.progress.filter((x: any) => x.score !== null).length;
        const sum = studentData.progress.reduce((acc: number, x: any) => 
          acc + (x.score !== null ? x.score : 0), 0);
        studentData.stats.avgScore = count > 0 ? parseFloat((sum / count).toFixed(1)) : null;
      }
      studentData.stats.totalTime += p.timeSpent ?? 0;
    }

    const students = Array.from(studentsMap.values()).map((s: any) => ({
      ...s,
      stats: {
        ...s.stats,
        completionRate: s.stats.completed + s.stats.inProgress > 0
          ? Math.round((s.stats.completed / (s.stats.completed + s.stats.inProgress)) * 100)
          : 0,
      },
    }));

    // Overall summary
    const totalRecords = students.reduce((acc: number, s: any) => 
      acc + s.progress.length, 0);
    const totalCompleted = students.reduce((acc: number, s: any) => 
      acc + s.stats.completed, 0);
    
    const summary = {
      totalStudents: students.length,
      totalProgressRecords: totalRecords,
      avgCompletionRate: students.length > 0
        ? parseFloat((
            students.reduce((acc: number, s: any) => acc + (s.stats.completionRate || 0), 0) / 
            students.length
          ).toFixed(1))
        : 0,
      totalCompletedModules: totalCompleted,
    };

    await logAudit(
      mentorUserId,
      'PROGRESS_VIEW',
      { filters, recordsCount: progress.length }
    );

    return {
      data: { students, summary },
      message: 'Mentor dashboard retrieved successfully',
    };
  }

  /**
   * Get all progress (admin only) with pagination
   */
  static async getAllProgress(
    filters: {
      studentId?: string;
      moduleId?: string;
      isCompleted?: boolean;
      limit?: number;
      page?: number;
    }
  ): Promise<{ data: { progress: any[]; pagination: any }; message: string }> {
    const { studentId, moduleId, isCompleted, limit = 20, page = 1 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (moduleId) where.moduleId = moduleId;
    if (isCompleted !== undefined) {
      where.completedAt = isCompleted ? { not: null } : null;
    }

    const [progress, total] = await Promise.all([
      prisma.progress.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              user: { select: { email: true } },
            },
          },
          module: { select: { id: true, title: true, type: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.progress.count({ where }),
    ]);

    // Add computed status to each record
    const enrichedProgress = progress.map(p => ({
      ...p,
      status: computeStatus(p.completedAt),
    }));

    return {
      data: {
        progress: enrichedProgress,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
      message: 'Progress records retrieved successfully',
    };
  }

  /**
   * Add/update feedback on a student's progress (mentor only)
   * Uses the single 'feedback' field from schema
   */
  static async addMentorFeedback(
    mentorUserId: string,
    progressId: string,
    feedback: string
  ): Promise<{ data: Progress; message: string }> {
    // Get mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
      select: { id: true },
    });
    if (!mentorProfile) {
      throw new Error('Mentor profile not found');
    }

    // Verify progress record exists
    const progress = await prisma.progress.findUnique({
      where: { id: progressId },
      include: { student: true },
    });
    if (!progress) {
      throw new Error('Progress record not found');
    }

    // Check if mentor is assigned to this student via active session
    const assignment = await prisma.mentorshipSession.findFirst({
      where: {
        mentorId: mentorProfile.id,
        studentId: progress.studentId,
        status: { in: [SessionStatus.SCHEDULED, SessionStatus.COMPLETED] },
      },
    });
    if (!assignment) {
      throw new Error('Unauthorized: Mentor not assigned to this student');
    }

    const updated = await prisma.progress.update({
      where: { id: progressId },
      data: {
        feedback: feedback, // Single feedback field per schema
        lastSyncedAt: new Date(),
      },
    });

    await logAudit(
      mentorUserId,
      'PROGRESS_SUBMIT',
      { progressId, studentId: progress.studentId, feedbackLength: feedback.length }
    );

    return { data: updated, message: 'Feedback updated successfully' };
  }
}