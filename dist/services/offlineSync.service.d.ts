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
export declare const offlineSyncService: {
    getModulesForOffline(studentId: string): Promise<{
        type: import(".prisma/client").$Enums.ExerciseType;
        id: string;
        title: string;
        description: string | null;
        contentUrl: string;
        difficulty: string;
        estimatedDuration: number | null;
        orderIndex: number;
    }[]>;
    syncProgress(progressData: OfflineProgress[]): Promise<({
        success: boolean;
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            moduleId: string;
            score: number | null;
            feedback: string | null;
            completedAt: Date | null;
            timeSpent: number | null;
            isSynced: boolean;
            lastSyncedAt: Date | null;
        };
        error?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        error: any;
        data: OfflineProgress;
        progress?: undefined;
    })[]>;
    syncSubmissions(submissions: OfflineSubmission[]): Promise<({
        success: boolean;
        submission: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            moduleId: string;
            score: number | null;
            feedback: string | null;
            isSynced: boolean;
            lastSyncedAt: Date | null;
            submittedAt: Date;
            exerciseType: import(".prisma/client").$Enums.ExerciseType;
            submissionContent: import("@prisma/client/runtime/library").JsonValue;
            rubricScores: import("@prisma/client/runtime/library").JsonValue | null;
            isPassed: boolean | null;
            evaluatedAt: Date | null;
            evaluatedBy: string | null;
        };
        error?: undefined;
        data?: undefined;
    } | {
        success: boolean;
        error: any;
        data: OfflineSubmission;
        submission?: undefined;
    })[]>;
    getUnsyncedProgress(studentId: string): Promise<({
        module: {
            type: import(".prisma/client").$Enums.ExerciseType;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        moduleId: string;
        score: number | null;
        feedback: string | null;
        completedAt: Date | null;
        timeSpent: number | null;
        isSynced: boolean;
        lastSyncedAt: Date | null;
    })[]>;
    getUnsyncedSubmissions(studentId: string): Promise<({
        module: {
            type: import(".prisma/client").$Enums.ExerciseType;
            title: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        moduleId: string;
        score: number | null;
        feedback: string | null;
        isSynced: boolean;
        lastSyncedAt: Date | null;
        submittedAt: Date;
        exerciseType: import(".prisma/client").$Enums.ExerciseType;
        submissionContent: import("@prisma/client/runtime/library").JsonValue;
        rubricScores: import("@prisma/client/runtime/library").JsonValue | null;
        isPassed: boolean | null;
        evaluatedAt: Date | null;
        evaluatedBy: string | null;
    })[]>;
    markAsSynced(progressIds: string[], submissionIds: string[]): Promise<{
        progressCount: number;
        submissionCount: number;
    }>;
};
export {};
//# sourceMappingURL=offlineSync.service.d.ts.map