export declare const createMentorshipSession: (mentorId: string, studentId: string, scheduledFor: Date, duration?: number, location?: string, notes?: string) => Promise<{
    student: {
        id: string;
        user: {
            email: string;
        };
        fullName: string;
    };
    mentor: {
        id: string;
        user: {
            email: string;
        };
    };
} & {
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
}>;
export declare const createWeeklyLabSession: (mentorId: string, studentIds: string[], scheduledFor: Date, duration?: number, location?: string, notes?: string) => Promise<({
    student: {
        id: string;
        user: {
            email: string;
        };
        fullName: string;
    };
    mentor: {
        id: string;
        user: {
            email: string;
        };
    };
} & {
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
})[]>;
export declare const rescheduleSession: (sessionId: string, mentorId: string, newScheduledFor: Date, reason?: string) => Promise<{
    student: {
        id: string;
        user: {
            email: string;
        };
        fullName: string;
    };
} & {
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
}>;
export declare const cancelSession: (sessionId: string, mentorId: string, reason?: string) => Promise<{
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
}>;
export declare const completeSession: (sessionId: string, mentorId: string, notes?: string, actionItems?: string) => Promise<{
    student: {
        id: string;
        user: {
            email: string;
        };
        fullName: string;
    };
} & {
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
}>;
export declare const getMentorSessions: (mentorId: string, filters?: {
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    startDate?: Date;
    endDate?: Date;
    studentId?: string;
}) => Promise<({
    student: {
        id: string;
        user: {
            email: string;
        };
        gradeLevel: string;
        fullName: string;
    };
} & {
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
})[]>;
export declare const getStudentSessions: (studentId: string, filters?: {
    status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    startDate?: Date;
    endDate?: Date;
}) => Promise<({
    mentor: {
        id: string;
        user: {
            email: string;
        };
        expertise: string[];
    };
} & {
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
})[]>;
export declare const getUpcomingSessions: (mentorId: string) => Promise<({
    student: {
        id: string;
        user: {
            email: string;
        };
        gradeLevel: string;
        fullName: string;
    };
} & {
    status: import(".prisma/client").$Enums.SessionStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    mentorId: string;
    scheduledFor: Date;
    duration: number;
    location: string | null;
    notes: string | null;
    actionItems: string | null;
})[]>;
//# sourceMappingURL=sessionScheduling.service.d.ts.map