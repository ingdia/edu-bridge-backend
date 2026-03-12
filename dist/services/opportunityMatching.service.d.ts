export declare const matchOpportunitiesForStudent: (studentId: string) => Promise<{
    student: {
        id: string;
        fullName: string;
        gradeLevel: string;
        averageScore: number;
        overallGrade: string;
    };
    opportunities: {
        matchScore: number;
        matchReasons: string[];
        type: import(".prisma/client").$Enums.OpportunityType;
        id: string;
        gradeLevel: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        organization: string;
        deadline: Date | null;
        applicationUrl: string | null;
        title: string;
        description: string;
        minGrade: string | null;
        requiredSkills: string[];
        contactEmail: string | null;
        postedBy: string | null;
        viewCount: number;
        applyCount: number;
    }[];
    totalMatches: number;
}>;
export declare const getTopPerformersForOpportunity: (opportunityId: string, limit?: number) => Promise<{
    opportunity: {
        id: string;
        title: string;
        organization: string;
        type: import(".prisma/client").$Enums.OpportunityType;
    };
    topPerformers: {
        id: string;
        fullName: string;
        gradeLevel: string;
        averageScore: number;
        overallGrade: string;
        matchScore: number;
        matchReasons: string[];
    }[];
    totalMatched: number;
}>;
export declare const recommendOpportunitiesByType: (studentId: string, type: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY" | "TRAINING") => Promise<{
    student: {
        id: string;
        fullName: string;
        gradeLevel: string;
        averageScore: number;
        overallGrade: string;
    };
    opportunities: {
        matchScore: number;
        matchReasons: string[];
        type: import(".prisma/client").$Enums.OpportunityType;
        id: string;
        gradeLevel: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        location: string | null;
        organization: string;
        deadline: Date | null;
        applicationUrl: string | null;
        title: string;
        description: string;
        minGrade: string | null;
        requiredSkills: string[];
        contactEmail: string | null;
        postedBy: string | null;
        viewCount: number;
        applyCount: number;
    }[];
    totalMatches: number;
}>;
//# sourceMappingURL=opportunityMatching.service.d.ts.map