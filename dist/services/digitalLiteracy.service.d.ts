export declare class DigitalLiteracyService {
    startLesson(studentId: string, lessonTitle: string, lessonType: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        score: number | null;
        completedAt: Date | null;
        lessonTitle: string;
        lessonType: string;
        completed: boolean;
        practiceData: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    completeLesson(studentId: string, lessonTitle: string, lessonType: string, score?: number, practiceData?: Record<string, any>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        score: number | null;
        completedAt: Date | null;
        lessonTitle: string;
        lessonType: string;
        completed: boolean;
        practiceData: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getStudentProgress(studentId: string, filters?: {
        lessonType?: string;
        completed?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        score: number | null;
        completedAt: Date | null;
        lessonTitle: string;
        lessonType: string;
        completed: boolean;
        practiceData: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    getStudentStats(studentId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        averageScore: number;
        progressByType: Record<string, {
            total: number;
            completed: number;
        }>;
    }>;
    getAllStudentsProgress(filters?: {
        lessonType?: string;
        completed?: boolean;
    }): Promise<({
        student: {
            id: string;
            gradeLevel: string;
            fullName: string;
            schoolName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        score: number | null;
        completedAt: Date | null;
        lessonTitle: string;
        lessonType: string;
        completed: boolean;
        practiceData: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
}
export declare const digitalLiteracyService: DigitalLiteracyService;
//# sourceMappingURL=digitalLiteracy.service.d.ts.map