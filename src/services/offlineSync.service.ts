import prisma from '../config/database';

interface OfflineProgress {
  studentId: string;
  moduleId: string;
  score?: number;
  feedback?: string;
  completedAt?: Date;
  timeSpent?: number;
}

interface OfflineSubmission {
  studentId: string;
  moduleId: string;
  exerciseType: string;
  submissionContent: any;
  submittedAt: Date;
}

export const offlineSyncService = {
  async getModulesForOffline(studentId: string) {
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      select: { gradeLevel: true }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return await prisma.learningModule.findMany({
      where: {
        isActive: true
      },
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        contentUrl: true,
        difficulty: true,
        estimatedDuration: true,
        orderIndex: true
      }
    });
  },

  async syncProgress(progressData: OfflineProgress[]) {
    const results = [];

    for (const data of progressData) {
      try {
        const existing = await prisma.progress.findUnique({
          where: {
            studentId_moduleId: {
              studentId: data.studentId,
              moduleId: data.moduleId
            }
          }
        });

        if (existing) {
          const updated = await prisma.progress.update({
            where: {
              studentId_moduleId: {
                studentId: data.studentId,
                moduleId: data.moduleId
              }
            },
            data: {
              score: data.score,
              feedback: data.feedback,
              completedAt: data.completedAt,
              timeSpent: data.timeSpent,
              isSynced: true,
              lastSyncedAt: new Date()
            }
          });
          results.push({ success: true, progress: updated });
        } else {
          const created = await prisma.progress.create({
            data: {
              studentId: data.studentId,
              moduleId: data.moduleId,
              score: data.score,
              feedback: data.feedback,
              completedAt: data.completedAt,
              timeSpent: data.timeSpent,
              isSynced: true,
              lastSyncedAt: new Date()
            }
          });
          results.push({ success: true, progress: created });
        }
      } catch (error: any) {
        results.push({ success: false, error: error.message, data });
      }
    }

    return results;
  },

  async syncSubmissions(submissions: OfflineSubmission[]) {
    const results = [];

    for (const data of submissions) {
      try {
        const created = await prisma.exerciseSubmission.create({
          data: {
            studentId: data.studentId,
            moduleId: data.moduleId,
            exerciseType: data.exerciseType as any,
            submissionContent: data.submissionContent,
            submittedAt: data.submittedAt,
            isSynced: true,
            lastSyncedAt: new Date()
          }
        });
        results.push({ success: true, submission: created });
      } catch (error: any) {
        results.push({ success: false, error: error.message, data });
      }
    }

    return results;
  },

  async getUnsyncedProgress(studentId: string) {
    return await prisma.progress.findMany({
      where: {
        studentId,
        isSynced: false
      },
      include: {
        module: {
          select: {
            title: true,
            type: true
          }
        }
      }
    });
  },

  async getUnsyncedSubmissions(studentId: string) {
    return await prisma.exerciseSubmission.findMany({
      where: {
        studentId,
        isSynced: false
      },
      include: {
        module: {
          select: {
            title: true,
            type: true
          }
        }
      }
    });
  },

  async markAsSynced(progressIds: string[], submissionIds: string[]) {
    const progressUpdate = prisma.progress.updateMany({
      where: { id: { in: progressIds } },
      data: {
        isSynced: true,
        lastSyncedAt: new Date()
      }
    });

    const submissionUpdate = prisma.exerciseSubmission.updateMany({
      where: { id: { in: submissionIds } },
      data: {
        isSynced: true,
        lastSyncedAt: new Date()
      }
    });

    await prisma.$transaction([progressUpdate, submissionUpdate]);

    return { progressCount: progressIds.length, submissionCount: submissionIds.length };
  }
};
