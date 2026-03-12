export declare const searchStudents: (query: string, filters?: {
    gradeLevel?: string;
    district?: string;
    limit?: number;
}) => Promise<{
    id: any;
    userId: any;
    fullName: any;
    email: any;
    nationalId: any;
    schoolName: any;
    gradeLevel: any;
    district: any;
    isActive: any;
    lastLogin: any;
}[]>;
export declare const searchModules: (query: string, filters?: {
    type?: string;
    difficulty?: string;
    isActive?: boolean;
    limit?: number;
}) => Promise<{
    id: any;
    title: any;
    description: any;
    type: any;
    difficulty: any;
    isActive: any;
    totalAttempts: any;
    totalSubmissions: any;
}[]>;
export declare const searchOpportunities: (query: string, filters?: {
    type?: string;
    gradeLevel?: string;
    location?: string;
    isActive?: boolean;
    limit?: number;
}) => Promise<{
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
export declare const globalSearch: (query: string, limit?: number) => Promise<{
    students: {
        id: any;
        userId: any;
        fullName: any;
        email: any;
        nationalId: any;
        schoolName: any;
        gradeLevel: any;
        district: any;
        isActive: any;
        lastLogin: any;
    }[];
    modules: {
        id: any;
        title: any;
        description: any;
        type: any;
        difficulty: any;
        isActive: any;
        totalAttempts: any;
        totalSubmissions: any;
    }[];
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
    total: number;
}>;
//# sourceMappingURL=search.service.d.ts.map