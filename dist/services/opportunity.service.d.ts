export declare class OpportunityService {
    createOpportunity(adminId: string, data: any): Promise<{
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
    }>;
    getOpportunities(filters: any): Promise<{
        opportunities: {
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
        pagination: {
            total: number;
            page: any;
            limit: any;
            totalPages: number;
        };
    }>;
    getMatchedOpportunities(userId: string): Promise<{
        matchScore: number;
        matchedSkills: string[];
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
    }[]>;
    getOpportunityById(id: string): Promise<{
        postedByAdmin: {
            user: {
                email: string;
            };
        } | null;
    } & {
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
    }>;
    updateOpportunity(id: string, data: any): Promise<{
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
    }>;
    deleteOpportunity(id: string): Promise<void>;
    incrementViewCount(id: string): Promise<void>;
    incrementApplyCount(id: string): Promise<void>;
}
export declare const opportunityService: OpportunityService;
//# sourceMappingURL=opportunity.service.d.ts.map