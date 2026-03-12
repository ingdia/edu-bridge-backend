// src/services/analytics.service.ts
import prisma from '../config/database';

// ─────────────────────────────────────────────────────────────
// SYSTEM OVERVIEW ANALYTICS
// ─────────────────────────────────────────────────────────────

export const getSystemOverview = async () => {
  const [
    totalStudents,
    totalMentors,
    totalAdmins,
    activeStudents,
    totalModules,
    activeModules,
    totalSubmissions,
    totalSessions,
    completedSessions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
    prisma.user.count({ where: { role: 'MENTOR', isActive: true } }),
    prisma.user.count({ where: { role: 'ADMIN', isActive: true } }),
    prisma.user.count({
      where: {
        role: 'STUDENT',
        isActive: true,
        lastLogin: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
      },
    }),
    prisma.learningModule.count(),
    prisma.learningModule.count({ where: { isActive: true } }),
    prisma.exerciseSubmission.count(),
    prisma.mentorshipSession.count(),
    prisma.mentorshipSession.count({ where: { status: 'COMPLETED' } }),
  ]);

  return {
    users: {
      totalStudents,
      totalMentors,
      totalAdmins,
      activeStudents,
      activeRate: totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : '0',
    },
    modules: {
      total: totalModules,
      active: activeModules,
    },
    submissions: {
      total: totalSubmissions,
    },
    sessions: {
      total: totalSessions,
      completed: completedSessions,
      completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : '0',
    },
  };
};

// ─────────────────────────────────────────────────────────────
// STUDENT PERFORMANCE ANALYTICS
// ─────────────────────────────────────────────────────────────

export const getStudentPerformanceAnalytics = async (filters?: {
  gradeLevel?: string;
  district?: string;
  limit?: number;
}) => {
  const whereClause: any = {};
  if (filters?.gradeLevel) whereClause.gradeLevel = filters.gradeLevel;
  if (filters?.district) whereClause.district = filters.district;

  // Get top performing students
  const topStudents = await prisma.studentProfile.findMany({
    where: whereClause,
    include: {
      user: { select: { email: true } },
      progress: {
        where: { score: { not: null } },
        select: { score: true },
      },
    },
    take: filters?.limit || 10,
  });

  const studentsWithAvgScore = topStudents
    .map((student: any) => {
      const scores = student.progress.map((p: any) => p.score).filter((s: any) => s !== null) as number[];
      const avgScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

      return {
        id: student.id,
        fullName: student.fullName,
        email: student.user.email,
        gradeLevel: student.gradeLevel,
        district: student.district,
        averageScore: parseFloat(avgScore.toFixed(1)),
        completedExercises: scores.length,
      };
    })
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, filters?.limit || 10);

  // Get overall statistics
  const allProgress = await prisma.progress.findMany({
    where: {
      student: whereClause,
      score: { not: null },
    },
    select: { score: true },
  });

  const allScores = allProgress.map((p: any) => p.score).filter((s: any) => s !== null) as number[];
  const overallAverage = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

  return {
    topStudents: studentsWithAvgScore,
    statistics: {
      totalStudents: topStudents.length,
      overallAverage: parseFloat(overallAverage.toFixed(1)),
      totalCompletedExercises: allScores.length,
    },
  };
};

// ─────────────────────────────────────────────────────────────
// MODULE ENGAGEMENT ANALYTICS
// ─────────────────────────────────────────────────────────────

export const getModuleEngagementAnalytics = async () => {
  const modules = await prisma.learningModule.findMany({
    where: { isActive: true },
    include: {
      progress: {
        select: {
          completedAt: true,
          score: true,
        },
      },
      exerciseSubmissions: {
        select: {
          submittedAt: true,
        },
      },
    },
  });

  const moduleStats = modules.map((module: any) => {
    const completedCount = module.progress.filter((p: any) => p.completedAt !== null).length;
    const scores = module.progress.map((p) => p.score).filter((s) => s !== null) as number[];
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      id: module.id,
      title: module.title,
      type: module.type,
      difficulty: module.difficulty,
      totalAttempts: module.progress.length,
      completedCount,
      completionRate: module.progress.length > 0 ? ((completedCount / module.progress.length) * 100).toFixed(1) : '0',
      averageScore: parseFloat(avgScore.toFixed(1)),
      submissionsCount: module.exerciseSubmissions.length,
    };
  });

  // Sort by popularity (total attempts)
  moduleStats.sort((a, b) => b.totalAttempts - a.totalAttempts);

  // Get engagement by exercise type
  const exerciseTypes = ['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY'] as const;
  const engagementByType = await Promise.all(
    exerciseTypes.map(async (type) => {
      const count = await prisma.exerciseSubmission.count({
        where: { exerciseType: type },
      });
      return { type, count };
    })
  );

  return {
    modules: moduleStats,
    engagementByType,
  };
};

// ─────────────────────────────────────────────────────────────
// MENTOR EFFECTIVENESS ANALYTICS
// ─────────────────────────────────────────────────────────────

export const getMentorEffectivenessAnalytics = async () => {
  const mentors = await prisma.mentorProfile.findMany({
    include: {
      user: { select: { email: true } },
      sessions: {
        select: {
          status: true,
          scheduledFor: true,
        },
      },
      exerciseEvaluations: {
        select: {
          evaluatedAt: true,
          score: true,
        },
      },
      assignedStudents: {
        include: {
          progress: {
            where: { score: { not: null } },
            select: { score: true },
          },
        },
      },
    },
  });

  const mentorStats = mentors.map((mentor) => {
    const totalSessions = mentor.sessions.length;
    const completedSessions = mentor.sessions.filter((s) => s.status === 'COMPLETED').length;
    const evaluationsCount = mentor.exerciseEvaluations.length;

    // Calculate average score of assigned students
    const allScores: number[] = [];
    mentor.assignedStudents.forEach((student) => {
      student.progress.forEach((p) => {
        if (p.score !== null) allScores.push(p.score);
      });
    });
    const avgStudentScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

    return {
      id: mentor.id,
      email: mentor.user.email,
      assignedStudents: mentor.assignedStudents.length,
      totalSessions,
      completedSessions,
      sessionCompletionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : '0',
      evaluationsCount,
      averageStudentScore: parseFloat(avgStudentScore.toFixed(1)),
    };
  });

  return {
    mentors: mentorStats,
    summary: {
      totalMentors: mentors.length,
      totalSessions: mentorStats.reduce((sum, m) => sum + m.totalSessions, 0),
      totalEvaluations: mentorStats.reduce((sum, m) => sum + m.evaluationsCount, 0),
    },
  };
};

// ─────────────────────────────────────────────────────────────
// PROGRESS OVER TIME (CHART DATA)
// ─────────────────────────────────────────────────────────────

export const getProgressOverTime = async (studentId?: string, days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const whereClause: any = {
    completedAt: { gte: startDate },
  };
  if (studentId) whereClause.studentId = studentId;

  const progress = await prisma.progress.findMany({
    where: whereClause,
    select: {
      completedAt: true,
      score: true,
    },
    orderBy: { completedAt: 'asc' },
  });

  // Group by date
  const progressByDate: { [key: string]: { count: number; totalScore: number } } = {};

  progress.forEach((p) => {
    if (p.completedAt) {
      const date = p.completedAt.toISOString().split('T')[0];
      if (!progressByDate[date]) {
        progressByDate[date] = { count: 0, totalScore: 0 };
      }
      progressByDate[date].count++;
      if (p.score !== null) {
        progressByDate[date].totalScore += p.score;
      }
    }
  });

  const chartData = Object.entries(progressByDate).map(([date, data]) => ({
    date,
    exercisesCompleted: data.count,
    averageScore: data.count > 0 ? parseFloat((data.totalScore / data.count).toFixed(1)) : 0,
  }));

  return {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: 'Exercises Completed',
        data: chartData.map((d) => d.exercisesCompleted),
      },
      {
        label: 'Average Score',
        data: chartData.map((d) => d.averageScore),
      },
    ],
  };
};

// ─────────────────────────────────────────────────────────────
// APPLICATION STATISTICS
// ─────────────────────────────────────────────────────────────

export const getApplicationStatistics = async () => {
  const [totalApplications, byStatus, byType] = await Promise.all([
    prisma.jobApplication.count(),
    prisma.jobApplication.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.jobApplication.groupBy({
      by: ['type'],
      _count: true,
    }),
  ]);

  return {
    total: totalApplications,
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
    byType: byType.map((t) => ({ type: t.type, count: t._count })),
  };
};
