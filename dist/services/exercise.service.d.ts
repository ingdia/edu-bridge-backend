import { Prisma } from '@prisma/client';
import { ExerciseSubmissionInput, GetSubmissionsQuery, EvaluateSubmissionInput } from '../validators/exercise.validator';
export declare class ExerciseService {
    /**
     * Submit text-based exercise (LISTENING, READING, WRITING, DIGITAL_LITERACY)
     */
    static submitTextExercise(studentId: string, data: ExerciseSubmissionInput): Promise<{
        data: {
            submission: any;
            progressUpdated: boolean;
        };
        message: string;
    }>;
    /**
     * Submit speaking exercise with audio file
     */
    static submitSpeakingExercise(studentId: string, moduleId: string, file: Express.Multer.File, metadata: {
        transcript?: string;
        recordingDuration?: number;
        notes?: string;
    }): Promise<{
        data: {
            submission: any;
            fileUrl: string;
        };
        message: string;
    }>;
    /**
     * Get student's own submissions
     */
    static getStudentSubmissions(studentId: string, filters: GetSubmissionsQuery): Promise<{
        data: {
            submissions: any[];
            summary: any;
            pagination: any;
        };
        message: string;
    }>;
    /**
     * Get submissions for mentor review (assigned students only)
     */
    static getMentorSubmissions(mentorId: string, filters: GetSubmissionsQuery): Promise<{
        data: {
            submissions: any[];
            summary: any;
            pagination: any;
        };
        message: string;
    }>;
    /**
     * Mentor evaluates a submission
     */
    static evaluateSubmission(mentorId: string, submissionId: string, evaluation: EvaluateSubmissionInput): Promise<{
        data: any;
        message: string;
    }>;
    /**
     * Admin: Get all submissions with filters
     */
    static getAllSubmissions(filters: GetSubmissionsQuery): Promise<{
        data: {
            submissions: ({
                student: {
                    id: string;
                    user: {
                        email: string;
                    };
                    fullName: string;
                };
                module: {
                    type: import(".prisma/client").$Enums.ExerciseType;
                    id: string;
                    title: string;
                };
                evaluator: {
                    id: string;
                    user: {
                        email: string;
                    };
                } | null;
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
                submissionContent: Prisma.JsonValue;
                rubricScores: Prisma.JsonValue | null;
                isPassed: boolean | null;
                evaluatedAt: Date | null;
                evaluatedBy: string | null;
            })[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        };
        message: string;
    }>;
}
//# sourceMappingURL=exercise.service.d.ts.map