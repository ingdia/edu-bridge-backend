import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DigitalLiteracyService {
  // Start a new digital literacy lesson
  async startLesson(studentId: string, lessonTitle: string, lessonType: string) {
    const existingProgress = await prisma.digitalLiteracyProgress.findFirst({
      where: {
        studentId,
        lessonTitle,
        lessonType,
      },
    });

    if (existingProgress) {
      return existingProgress;
    }

    return await prisma.digitalLiteracyProgress.create({
      data: {
        studentId,
        lessonTitle,
        lessonType,
        completed: false,
      },
    });
  }

  // Complete a digital literacy lesson
  async completeLesson(
    studentId: string,
    lessonTitle: string,
    lessonType: string,
    score?: number,
    practiceData?: Record<string, any>
  ) {
    const progress = await prisma.digitalLiteracyProgress.findFirst({
      where: {
        studentId,
        lessonTitle,
        lessonType,
      },
    });

    if (!progress) {
      throw new Error('Lesson progress not found. Please start the lesson first.');
    }

    return await prisma.digitalLiteracyProgress.update({
      where: { id: progress.id },
      data: {
        completed: true,
        score,
        completedAt: new Date(),
        practiceData: practiceData || undefined,
      },
    });
  }

  // Get student's digital literacy progress
  async getStudentProgress(studentId: string, filters?: { lessonType?: string; completed?: boolean }) {
    const where: any = { studentId };

    if (filters?.lessonType) {
      where.lessonType = filters.lessonType;
    }

    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }

    return await prisma.digitalLiteracyProgress.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get overall digital literacy statistics for a student
  async getStudentStats(studentId: string) {
    const allLessons = await prisma.digitalLiteracyProgress.findMany({
      where: { studentId },
    });

    const completedLessons = allLessons.filter((l) => l.completed);
    const averageScore =
      completedLessons.length > 0
        ? completedLessons.reduce((sum, l) => sum + (l.score || 0), 0) / completedLessons.length
        : 0;

    const byType = allLessons.reduce((acc, lesson) => {
      if (!acc[lesson.lessonType]) {
        acc[lesson.lessonType] = { total: 0, completed: 0 };
      }
      acc[lesson.lessonType].total++;
      if (lesson.completed) {
        acc[lesson.lessonType].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return {
      totalLessons: allLessons.length,
      completedLessons: completedLessons.length,
      averageScore: Math.round(averageScore),
      progressByType: byType,
    };
  }

  // Get all students' digital literacy progress (for mentors/admins)
  async getAllStudentsProgress(filters?: { lessonType?: string; completed?: boolean }) {
    const where: any = {};

    if (filters?.lessonType) {
      where.lessonType = filters.lessonType;
    }

    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }

    return await prisma.digitalLiteracyProgress.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            schoolName: true,
            gradeLevel: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const digitalLiteracyService = new DigitalLiteracyService();
