export declare const getSystemOverview: () => Promise<{
    users: {
        totalStudents: number;
        totalMentors: number;
        totalAdmins: number;
        activeStudents: number;
        activeRate: string;
    };
    modules: {
        total: number;
        active: number;
    };
    submissions: {
        total: number;
    };
    sessions: {
        total: number;
        completed: number;
        completionRate: string;
    };
}>;
export declare const getStudentPerformanceAnalytics: (filters?: {
    gradeLevel?: string;
    district?: string;
    limit?: number;
}) => Promise<{
    topStudents: {
        id: any;
        fullName: any;
        email: any;
        gradeLevel: any;
        district: any;
        averageScore: number;
        completedExercises: number;
    }[];
    statistics: {
        totalStudents: number;
        overallAverage: number;
        totalCompletedExercises: number;
    };
}>;
export declare const getModuleEngagementAnalytics: () => Promise<{
    modules: {
        id: any;
        title: any;
        type: any;
        difficulty: any;
        totalAttempts: any;
        completedCount: any;
        completionRate: string;
        averageScore: number;
        submissionsCount: any;
    }[];
    engagementByType: {
        type: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "DIGITAL_LITERACY";
        count: number;
    }[];
}>;
export declare const getMentorEffectivenessAnalytics: () => Promise<{
    mentors: {
        id: any;
        email: any;
        assignedStudents: any;
        totalSessions: any;
        completedSessions: any;
        sessionCompletionRate: string;
        evaluationsCount: any;
        averageStudentScore: number;
    }[];
    summary: {
        totalMentors: number;
        totalSessions: number;
        totalEvaluations: number;
    };
}>;
export declare const getProgressOverTime: (studentId?: string, days?: number) => Promise<{
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}>;
export declare const getApplicationStatistics: () => Promise<{
    total: number;
    byStatus: {
        status: any;
        count: any;
    }[];
    byType: {
        type: any;
        count: any;
    }[];
}>;
//# sourceMappingURL=analytics.service.d.ts.map