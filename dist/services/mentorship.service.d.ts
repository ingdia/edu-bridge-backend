import { CreateSessionInput, UpdateSessionInput, RescheduleSessionInput, CancelSessionInput, GetSessionsQuery } from '../validators/mentorship.validator';
export declare class MentorshipService {
    static createSession(data: CreateSessionInput, mentorUserId: string): Promise<{
        data: {
            student: {
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
        };
        message: string;
    }>;
    static updateSession(sessionId: string, data: UpdateSessionInput, mentorUserId: string): Promise<{
        data: {
            student: {
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
        };
        message: string;
    }>;
    static rescheduleSession(sessionId: string, data: RescheduleSessionInput, mentorUserId: string): Promise<{
        data: {
            student: {
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
        };
        message: string;
    }>;
    static cancelSession(sessionId: string, data: CancelSessionInput, userId: string, userRole: string): Promise<{
        data: {
            student: {
                fullName: string;
            };
            mentor: {
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
        };
        message: string;
    }>;
    static getMentorSessions(mentorUserId: string, filters?: GetSessionsQuery): Promise<{
        data: ({
            student: {
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
        })[];
        message: string;
    }>;
    static getStudentSessions(studentUserId: string, filters?: GetSessionsQuery): Promise<{
        data: ({
            mentor: {
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
        })[];
        message: string;
    }>;
    static getUpcomingSessions(userId: string, userRole: string): Promise<{
        data: ({
            student: {
                gradeLevel: string;
                fullName: string;
            };
            mentor: {
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
        })[];
        message: string;
    }>;
    static getCalendarView(userId: string, userRole: string, month: number, year: number): Promise<{
        data: any;
        message: string;
    }>;
    private static checkSchedulingConflict;
}
//# sourceMappingURL=mentorship.service.d.ts.map