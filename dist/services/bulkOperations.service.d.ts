interface BulkStudentData {
    email: string;
    fullName: string;
    dateOfBirth: string;
    nationalId: string;
    gradeLevel: string;
    schoolName?: string;
    guardianName?: string;
    guardianContact?: string;
}
interface BulkGradeData {
    studentNationalId: string;
    term: string;
    year: number;
    subjects: any;
    overallGrade: string;
}
interface BulkNotificationData {
    recipientIds: string[];
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
}
export declare const bulkOperationsService: {
    importStudents(students: BulkStudentData[], createdBy: string): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: {
            success: boolean;
            email: string;
            userId: string;
            studentId: string | undefined;
        }[];
        errors: {
            email: string;
            error: any;
        }[];
    }>;
    uploadGrades(grades: BulkGradeData[], uploadedBy: string): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: {
            success: boolean;
            nationalId: string;
            studentId: string;
            reportId: string;
        }[];
        errors: {
            nationalId: string;
            error: any;
        }[];
    }>;
    sendBulkNotifications(data: BulkNotificationData, sentBy: string): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: {
            success: boolean;
            recipientId: string;
            notificationId: string;
        }[];
        errors: {
            recipientId: string;
            error: any;
        }[];
    }>;
    assignMentorsToStudents(assignments: {
        studentId: string;
        mentorId: string;
    }[]): Promise<{
        total: number;
        successful: number;
        failed: number;
        results: {
            success: boolean;
            studentId: string;
            mentorId: string;
        }[];
        errors: {
            studentId: string;
            error: any;
        }[];
    }>;
};
export {};
//# sourceMappingURL=bulkOperations.service.d.ts.map