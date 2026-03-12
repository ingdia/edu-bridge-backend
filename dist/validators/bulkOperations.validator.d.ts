import { z } from 'zod';
export declare const bulkStudentSchema: z.ZodObject<{
    email: z.ZodString;
    fullName: z.ZodString;
    dateOfBirth: z.ZodString;
    nationalId: z.ZodString;
    gradeLevel: z.ZodString;
    schoolName: z.ZodOptional<z.ZodString>;
    guardianName: z.ZodOptional<z.ZodString>;
    guardianContact: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    gradeLevel: string;
    fullName: string;
    nationalId: string;
    dateOfBirth: string;
    guardianName?: string | undefined;
    guardianContact?: string | undefined;
    schoolName?: string | undefined;
}, {
    email: string;
    gradeLevel: string;
    fullName: string;
    nationalId: string;
    dateOfBirth: string;
    guardianName?: string | undefined;
    guardianContact?: string | undefined;
    schoolName?: string | undefined;
}>;
export declare const importStudentsSchema: z.ZodObject<{
    body: z.ZodObject<{
        students: z.ZodArray<z.ZodObject<{
            email: z.ZodString;
            fullName: z.ZodString;
            dateOfBirth: z.ZodString;
            nationalId: z.ZodString;
            gradeLevel: z.ZodString;
            schoolName: z.ZodOptional<z.ZodString>;
            guardianName: z.ZodOptional<z.ZodString>;
            guardianContact: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            gradeLevel: string;
            fullName: string;
            nationalId: string;
            dateOfBirth: string;
            guardianName?: string | undefined;
            guardianContact?: string | undefined;
            schoolName?: string | undefined;
        }, {
            email: string;
            gradeLevel: string;
            fullName: string;
            nationalId: string;
            dateOfBirth: string;
            guardianName?: string | undefined;
            guardianContact?: string | undefined;
            schoolName?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        students: {
            email: string;
            gradeLevel: string;
            fullName: string;
            nationalId: string;
            dateOfBirth: string;
            guardianName?: string | undefined;
            guardianContact?: string | undefined;
            schoolName?: string | undefined;
        }[];
    }, {
        students: {
            email: string;
            gradeLevel: string;
            fullName: string;
            nationalId: string;
            dateOfBirth: string;
            guardianName?: string | undefined;
            guardianContact?: string | undefined;
            schoolName?: string | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        students: {
            email: string;
            gradeLevel: string;
            fullName: string;
            nationalId: string;
            dateOfBirth: string;
            guardianName?: string | undefined;
            guardianContact?: string | undefined;
            schoolName?: string | undefined;
        }[];
    };
}, {
    body: {
        students: {
            email: string;
            gradeLevel: string;
            fullName: string;
            nationalId: string;
            dateOfBirth: string;
            guardianName?: string | undefined;
            guardianContact?: string | undefined;
            schoolName?: string | undefined;
        }[];
    };
}>;
export declare const bulkGradeSchema: z.ZodObject<{
    studentNationalId: z.ZodString;
    term: z.ZodString;
    year: z.ZodNumber;
    subjects: z.ZodRecord<z.ZodString, z.ZodAny>;
    overallGrade: z.ZodString;
}, "strip", z.ZodTypeAny, {
    term: string;
    year: number;
    subjects: Record<string, any>;
    overallGrade: string;
    studentNationalId: string;
}, {
    term: string;
    year: number;
    subjects: Record<string, any>;
    overallGrade: string;
    studentNationalId: string;
}>;
export declare const uploadGradesSchema: z.ZodObject<{
    body: z.ZodObject<{
        grades: z.ZodArray<z.ZodObject<{
            studentNationalId: z.ZodString;
            term: z.ZodString;
            year: z.ZodNumber;
            subjects: z.ZodRecord<z.ZodString, z.ZodAny>;
            overallGrade: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            term: string;
            year: number;
            subjects: Record<string, any>;
            overallGrade: string;
            studentNationalId: string;
        }, {
            term: string;
            year: number;
            subjects: Record<string, any>;
            overallGrade: string;
            studentNationalId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        grades: {
            term: string;
            year: number;
            subjects: Record<string, any>;
            overallGrade: string;
            studentNationalId: string;
        }[];
    }, {
        grades: {
            term: string;
            year: number;
            subjects: Record<string, any>;
            overallGrade: string;
            studentNationalId: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        grades: {
            term: string;
            year: number;
            subjects: Record<string, any>;
            overallGrade: string;
            studentNationalId: string;
        }[];
    };
}, {
    body: {
        grades: {
            term: string;
            year: number;
            subjects: Record<string, any>;
            overallGrade: string;
            studentNationalId: string;
        }[];
    };
}>;
export declare const sendBulkNotificationsSchema: z.ZodObject<{
    body: z.ZodObject<{
        recipientIds: z.ZodArray<z.ZodString, "many">;
        type: z.ZodEnum<["SESSION_REMINDER", "DEADLINE_ALERT", "FEEDBACK_RECEIVED", "APPLICATION_UPDATE", "SYSTEM_ANNOUNCEMENT"]>;
        title: z.ZodString;
        message: z.ZodString;
        actionUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
    }, {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
    };
}, {
    body: {
        message: string;
        type: "APPLICATION_UPDATE" | "SESSION_REMINDER" | "DEADLINE_ALERT" | "FEEDBACK_RECEIVED" | "SYSTEM_ANNOUNCEMENT";
        title: string;
        recipientIds: string[];
        actionUrl?: string | undefined;
    };
}>;
export declare const assignMentorsSchema: z.ZodObject<{
    body: z.ZodObject<{
        assignments: z.ZodArray<z.ZodObject<{
            studentId: z.ZodString;
            mentorId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            studentId: string;
            mentorId: string;
        }, {
            studentId: string;
            mentorId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        assignments: {
            studentId: string;
            mentorId: string;
        }[];
    }, {
        assignments: {
            studentId: string;
            mentorId: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        assignments: {
            studentId: string;
            mentorId: string;
        }[];
    };
}, {
    body: {
        assignments: {
            studentId: string;
            mentorId: string;
        }[];
    };
}>;
export type BulkStudentInput = z.infer<typeof bulkStudentSchema>;
export type BulkGradeInput = z.infer<typeof bulkGradeSchema>;
//# sourceMappingURL=bulkOperations.validator.d.ts.map