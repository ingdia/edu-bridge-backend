import { CreateCVInput, CreateJobApplicationInput, UpdateApplicationStatusInput } from '../validators/career.validator';
export declare class CareerService {
    static createOrUpdateCV(data: CreateCVInput, studentUserId: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            template: string | null;
            isSharedWithMentor: boolean;
        };
        message: string;
    }>;
    static getStudentCV(studentUserId: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            content: import("@prisma/client/runtime/library").JsonValue;
            template: string | null;
            isSharedWithMentor: boolean;
        } | null;
        message: string;
    }>;
    static createApplication(data: CreateJobApplicationInput, studentUserId: string): Promise<{
        data: {
            status: import(".prisma/client").$Enums.ApplicationStatus;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            notes: string | null;
            position: string;
            organization: string;
            deadline: Date | null;
            applicationUrl: string | null;
            submittedAt: Date | null;
            response: string | null;
            cvId: string | null;
            coverLetter: string | null;
        };
        message: string;
    }>;
    static updateApplicationStatus(applicationId: string, data: UpdateApplicationStatusInput, userId: string): Promise<{
        data: {
            status: import(".prisma/client").$Enums.ApplicationStatus;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            notes: string | null;
            position: string;
            organization: string;
            deadline: Date | null;
            applicationUrl: string | null;
            submittedAt: Date | null;
            response: string | null;
            cvId: string | null;
            coverLetter: string | null;
        };
        message: string;
    }>;
    static getStudentApplications(studentUserId: string): Promise<{
        data: ({
            cv: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                studentId: string;
                content: import("@prisma/client/runtime/library").JsonValue;
                template: string | null;
                isSharedWithMentor: boolean;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.ApplicationStatus;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            notes: string | null;
            position: string;
            organization: string;
            deadline: Date | null;
            applicationUrl: string | null;
            submittedAt: Date | null;
            response: string | null;
            cvId: string | null;
            coverLetter: string | null;
        })[];
        message: string;
    }>;
}
//# sourceMappingURL=career.service.d.ts.map