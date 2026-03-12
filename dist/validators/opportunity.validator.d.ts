import { z } from 'zod';
export declare const createOpportunitySchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        organization: z.ZodString;
        type: z.ZodEnum<["JOB", "INTERNSHIP", "SCHOLARSHIP", "UNIVERSITY", "TRAINING"]>;
        description: z.ZodString;
        minGrade: z.ZodOptional<z.ZodString>;
        requiredSkills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        gradeLevel: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        location: z.ZodOptional<z.ZodString>;
        applicationUrl: z.ZodOptional<z.ZodString>;
        deadline: z.ZodOptional<z.ZodString>;
        contactEmail: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING";
        organization: string;
        title: string;
        description: string;
        gradeLevel?: string[] | undefined;
        location?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    }, {
        type: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING";
        organization: string;
        title: string;
        description: string;
        gradeLevel?: string[] | undefined;
        location?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING";
        organization: string;
        title: string;
        description: string;
        gradeLevel?: string[] | undefined;
        location?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    };
}, {
    body: {
        type: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING";
        organization: string;
        title: string;
        description: string;
        gradeLevel?: string[] | undefined;
        location?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    };
}>;
export declare const updateOpportunitySchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        organization: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["JOB", "INTERNSHIP", "SCHOLARSHIP", "UNIVERSITY", "TRAINING"]>>;
        description: z.ZodOptional<z.ZodString>;
        minGrade: z.ZodOptional<z.ZodString>;
        requiredSkills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        gradeLevel: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        location: z.ZodOptional<z.ZodString>;
        applicationUrl: z.ZodOptional<z.ZodString>;
        deadline: z.ZodOptional<z.ZodString>;
        contactEmail: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string[] | undefined;
        isActive?: boolean | undefined;
        location?: string | undefined;
        organization?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    }, {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string[] | undefined;
        isActive?: boolean | undefined;
        location?: string | undefined;
        organization?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string[] | undefined;
        isActive?: boolean | undefined;
        location?: string | undefined;
        organization?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    };
}, {
    body: {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string[] | undefined;
        isActive?: boolean | undefined;
        location?: string | undefined;
        organization?: string | undefined;
        deadline?: string | undefined;
        applicationUrl?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        minGrade?: string | undefined;
        requiredSkills?: string[] | undefined;
        contactEmail?: string | undefined;
    };
}>;
export declare const getOpportunitiesQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<["JOB", "INTERNSHIP", "SCHOLARSHIP", "UNIVERSITY", "TRAINING"]>>;
        gradeLevel: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        limit: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string | undefined;
        isActive?: "true" | "false" | undefined;
        location?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
    }, {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string | undefined;
        isActive?: "true" | "false" | undefined;
        location?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string | undefined;
        isActive?: "true" | "false" | undefined;
        location?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
    };
}, {
    query: {
        type?: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING" | undefined;
        gradeLevel?: string | undefined;
        isActive?: "true" | "false" | undefined;
        location?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
    };
}>;
//# sourceMappingURL=opportunity.validator.d.ts.map