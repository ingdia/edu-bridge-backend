import { Progress } from '@prisma/client';
import { SubmitProgressInput, MentorDashboardFilters } from '../validators/progress.validator';
export declare class ProgressService {
    /**
     * Submit or update progress for a student on a module
     */
    static submitProgress(studentId: string, data: SubmitProgressInput): Promise<{
        data: Progress;
        message: string;
    }>;
    /**
     * Get student's own progress dashboard
     */
    static getStudentDashboard(studentId: string, filters?: {
        moduleId?: string;
        isCompleted?: boolean;
    }): Promise<{
        data: {
            progress: any[];
            summary: any;
        };
        message: string;
    }>;
    /**
     * Get mentor dashboard: progress of assigned students
     */
    static getMentorDashboard(mentorUserId: string, filters: MentorDashboardFilters): Promise<{
        data: {
            students: any[];
            summary: any;
        };
        message: string;
    }>;
    /**
     * Get all progress (admin only) with pagination
     */
    static getAllProgress(filters: {
        studentId?: string;
        moduleId?: string;
        isCompleted?: boolean;
        limit?: number;
        page?: number;
    }): Promise<{
        data: {
            progress: any[];
            pagination: any;
        };
        message: string;
    }>;
    /**
     * Add/update feedback on a student's progress (mentor only)
     * Uses the single 'feedback' field from schema
     */
    static addMentorFeedback(mentorUserId: string, progressId: string, feedback: string): Promise<{
        data: Progress;
        message: string;
    }>;
}
//# sourceMappingURL=progress.service.d.ts.map