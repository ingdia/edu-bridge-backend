export type DigitalLiteracyLessonType = 'email' | 'computer_basics' | 'internet_safety' | 'digital_communication' | 'file_handling';
export interface DigitalLiteracyLesson {
    id: string;
    title: string;
    type: DigitalLiteracyLessonType;
    description: string;
    content: {
        theory?: string;
        steps?: string[];
        practiceExercises?: any[];
        resources?: string[];
    };
    estimatedDuration: number;
    orderIndex: number;
}
export declare const getDigitalLiteracyLessons: (studentId: string) => Promise<{
    progress: {
        completed: boolean;
        score: number | null;
        completedAt: Date | null;
    } | null;
    id: string;
    title: string;
    type: DigitalLiteracyLessonType;
    description: string;
    content: {
        theory?: string;
        steps?: string[];
        practiceExercises?: any[];
        resources?: string[];
    };
    estimatedDuration: number;
    orderIndex: number;
}[]>;
export declare const startDigitalLiteracyLesson: (studentId: string, lessonTitle: string, lessonType: DigitalLiteracyLessonType) => Promise<{
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
export declare const completeDigitalLiteracyLesson: (studentId: string, lessonTitle: string, score?: number, practiceData?: any) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const getDigitalLiteracyProgressSummary: (studentId: string) => Promise<{
    totalLessons: number;
    completedLessons: number;
    inProgress: number;
    completionRate: string;
    averageScore: number | null;
    recentActivity: {
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
    }[];
}>;
//# sourceMappingURL=digitalLiteracy.service.d.ts.map