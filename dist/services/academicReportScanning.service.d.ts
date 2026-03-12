interface ExtractedGrade {
    subject: string;
    score: number;
    maxScore: number;
    grade?: string;
}
interface ScanResult {
    studentId: string;
    term: string;
    year: number;
    grades: ExtractedGrade[];
    overallAverage: number;
    extractedAt: Date;
    confidence: number;
}
export declare const academicReportScanningService: {
    scanReport(fileBuffer: Buffer, studentId: string, term: string, year: number): Promise<ScanResult>;
    saveScannedReport(scanResult: ScanResult, fileUrl: string, enteredBy: string): Promise<{
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
    }>;
    processReport(fileBuffer: Buffer, studentId: string, term: string, year: number, fileUrl: string, enteredBy: string): Promise<{
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
    }>;
    correctScannedData(recordId: string, corrections: {
        grades?: ExtractedGrade[];
        overallGrade?: number;
    }): Promise<{
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
    }>;
    getStudentScannedReports(studentId: string): Promise<{
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
    }[]>;
    getLowConfidenceScans(threshold?: number): Promise<({
        student: {
            id: string;
            user: {
                email: string;
            };
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
    })[]>;
};
export {};
//# sourceMappingURL=academicReportScanning.service.d.ts.map