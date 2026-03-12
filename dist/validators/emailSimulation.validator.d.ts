import { z } from 'zod';
export declare const sendEmailSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
    body: z.ZodObject<{
        to: z.ZodString;
        subject: z.ZodString;
        body: z.ZodString;
        cc: z.ZodOptional<z.ZodString>;
        bcc: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        to: string;
        subject: string;
        body: string;
        cc?: string | undefined;
        bcc?: string | undefined;
    }, {
        to: string;
        subject: string;
        body: string;
        cc?: string | undefined;
        bcc?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
    };
    body: {
        to: string;
        subject: string;
        body: string;
        cc?: string | undefined;
        bcc?: string | undefined;
    };
}, {
    params: {
        studentId: string;
    };
    body: {
        to: string;
        subject: string;
        body: string;
        cc?: string | undefined;
        bcc?: string | undefined;
    };
}>;
export declare const getInboxSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
    };
}, {
    params: {
        studentId: string;
    };
}>;
export declare const markAsReadSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
        emailId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        emailId: string;
    }, {
        studentId: string;
        emailId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
        emailId: string;
    };
}, {
    params: {
        studentId: string;
        emailId: string;
    };
}>;
export declare const getSentEmailsSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
    };
}, {
    params: {
        studentId: string;
    };
}>;
export type SendEmailInput = z.infer<typeof sendEmailSchema>['body'];
//# sourceMappingURL=emailSimulation.validator.d.ts.map