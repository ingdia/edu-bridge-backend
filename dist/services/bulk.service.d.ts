export interface BulkStudentData {
    fullName: string;
    email: string;
    dateOfBirth: string;
    nationalId: string;
    gradeLevel: string;
    schoolName?: string;
    guardianName?: string;
    guardianContact?: string;
    district?: string;
    province?: string;
}
export declare const bulkImportStudents: (students: BulkStudentData[], adminId: string) => Promise<{
    success: number;
    failed: number;
    errors: any[];
}>;
export interface BulkGradeData {
    studentId: string;
    term: string;
    year: number;
    subjects: Record<string, number>;
    overallGrade?: string;
    remarks?: string;
}
export declare const bulkGradeEntry: (grades: BulkGradeData[], adminId: string) => Promise<{
    success: number;
    failed: number;
    errors: any[];
}>;
export interface BulkNotificationData {
    recipientIds: string[];
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    sendEmail?: boolean;
}
export declare const bulkSendNotifications: (data: BulkNotificationData, senderId: string) => Promise<{
    success: number;
    failed: number;
}>;
export declare const bulkUpdateUserStatus: (userIds: string[], isActive: boolean, adminId: string) => Promise<{
    success: number;
}>;
//# sourceMappingURL=bulk.service.d.ts.map