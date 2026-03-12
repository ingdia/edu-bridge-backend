import { z } from 'zod';
export declare const uploadAcademicReportSchema: z.ZodObject<{
    studentId: z.ZodString;
    term: z.ZodString;
    year: z.ZodNumber;
    fileUrl: z.ZodString;
    fileName: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodNumber>;
    subjects: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    overallGrade: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    studentId: string;
    term: string;
    year: number;
    fileUrl: string;
    fileName?: string | undefined;
    fileSize?: number | undefined;
    subjects?: Record<string, any> | undefined;
    overallGrade?: string | undefined;
    remarks?: string | undefined;
}, {
    studentId: string;
    term: string;
    year: number;
    fileUrl: string;
    fileName?: string | undefined;
    fileSize?: number | undefined;
    subjects?: Record<string, any> | undefined;
    overallGrade?: string | undefined;
    remarks?: string | undefined;
}>;
export declare const manualEntrySchema: z.ZodObject<{
    studentId: z.ZodString;
    term: z.ZodString;
    year: z.ZodNumber;
    subjects: z.ZodRecord<z.ZodString, z.ZodAny>;
    overallGrade: z.ZodString;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    studentId: string;
    term: string;
    year: number;
    subjects: Record<string, any>;
    overallGrade: string;
    remarks?: string | undefined;
}, {
    studentId: string;
    term: string;
    year: number;
    subjects: Record<string, any>;
    overallGrade: string;
    remarks?: string | undefined;
}>;
export type UploadAcademicReportInput = z.infer<typeof uploadAcademicReportSchema>;
export type ManualEntryInput = z.infer<typeof manualEntrySchema>;
//# sourceMappingURL=academic.validator.d.ts.map