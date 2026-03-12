import { UploadAcademicReportInput, ManualEntryInput } from '../validators/academic.validator';
export declare class AcademicReportService {
    static uploadReport(data: UploadAcademicReportInput, adminId: string, file?: Express.Multer.File): Promise<{
        data: {
            student: {
                gradeLevel: string;
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            term: string;
            year: number;
            fileUrl: string;
            fileName: string | null;
            fileSize: number | null;
            subjects: import("@prisma/client/runtime/library").JsonValue | null;
            overallGrade: string | null;
            remarks: string | null;
            enteredBy: string;
            verifiedBy: string | null;
        };
        message: string;
    }>;
    static manualEntry(data: ManualEntryInput, adminId: string): Promise<{
        data: {
            student: {
                gradeLevel: string;
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            term: string;
            year: number;
            fileUrl: string;
            fileName: string | null;
            fileSize: number | null;
            subjects: import("@prisma/client/runtime/library").JsonValue | null;
            overallGrade: string | null;
            remarks: string | null;
            enteredBy: string;
            verifiedBy: string | null;
        };
        message: string;
    }>;
    static getStudentReports(studentId: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            term: string;
            year: number;
            fileUrl: string;
            fileName: string | null;
            fileSize: number | null;
            subjects: import("@prisma/client/runtime/library").JsonValue | null;
            overallGrade: string | null;
            remarks: string | null;
            enteredBy: string;
            verifiedBy: string | null;
        }[];
        message: string;
    }>;
    static deleteReport(reportId: string, adminId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=academic.service.d.ts.map