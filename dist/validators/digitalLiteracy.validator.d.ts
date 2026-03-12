import { z } from 'zod';
export declare const startLessonSchema: z.ZodObject<{
    body: z.ZodObject<{
        lessonTitle: z.ZodString;
        lessonType: z.ZodEnum<["email", "computer_basics", "internet_safety", "digital_communication"]>;
    }, "strip", z.ZodTypeAny, {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
    }, {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
    };
}, {
    body: {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
    };
}>;
export declare const completeLessonSchema: z.ZodObject<{
    body: z.ZodObject<{
        lessonTitle: z.ZodString;
        lessonType: z.ZodEnum<["email", "computer_basics", "internet_safety", "digital_communication"]>;
        score: z.ZodOptional<z.ZodNumber>;
        practiceData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
        score?: number | undefined;
        practiceData?: Record<string, any> | undefined;
    }, {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
        score?: number | undefined;
        practiceData?: Record<string, any> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
        score?: number | undefined;
        practiceData?: Record<string, any> | undefined;
    };
}, {
    body: {
        lessonTitle: string;
        lessonType: "email" | "computer_basics" | "internet_safety" | "digital_communication";
        score?: number | undefined;
        practiceData?: Record<string, any> | undefined;
    };
}>;
export declare const getLessonsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        lessonType: z.ZodOptional<z.ZodEnum<["email", "computer_basics", "internet_safety", "digital_communication"]>>;
        completed: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    }, "strip", z.ZodTypeAny, {
        lessonType?: "email" | "computer_basics" | "internet_safety" | "digital_communication" | undefined;
        completed?: "true" | "false" | undefined;
    }, {
        lessonType?: "email" | "computer_basics" | "internet_safety" | "digital_communication" | undefined;
        completed?: "true" | "false" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        lessonType?: "email" | "computer_basics" | "internet_safety" | "digital_communication" | undefined;
        completed?: "true" | "false" | undefined;
    };
}, {
    query: {
        lessonType?: "email" | "computer_basics" | "internet_safety" | "digital_communication" | undefined;
        completed?: "true" | "false" | undefined;
    };
}>;
//# sourceMappingURL=digitalLiteracy.validator.d.ts.map