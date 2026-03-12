"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitalLiteracyService = exports.DigitalLiteracyService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DigitalLiteracyService {
    // Start a new digital literacy lesson
    async startLesson(studentId, lessonTitle, lessonType) {
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
    async completeLesson(studentId, lessonTitle, lessonType, score, practiceData) {
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
    async getStudentProgress(studentId, filters) {
        const where = { studentId };
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
    async getStudentStats(studentId) {
        const allLessons = await prisma.digitalLiteracyProgress.findMany({
            where: { studentId },
        });
        const completedLessons = allLessons.filter((l) => l.completed);
        const averageScore = completedLessons.length > 0
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
        }, {});
        return {
            totalLessons: allLessons.length,
            completedLessons: completedLessons.length,
            averageScore: Math.round(averageScore),
            progressByType: byType,
        };
    }
    // Get all students' digital literacy progress (for mentors/admins)
    async getAllStudentsProgress(filters) {
        const where = {};
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
exports.DigitalLiteracyService = DigitalLiteracyService;
exports.digitalLiteracyService = new DigitalLiteracyService();
//# sourceMappingURL=digitalLiteracy.service.js.map