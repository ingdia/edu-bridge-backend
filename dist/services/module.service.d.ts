import type { CreateModuleInput, UpdateModuleInput, ListModulesQuery } from '../validators/module.validator';
import { Role, ExerciseType } from '@prisma/client';
export declare const createModule: (data: CreateModuleInput, adminId: string, ipAddress?: string) => Promise<{
    data: {
        module: {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            contentUrl: string;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
        };
    };
    message: string;
}>;
export declare const getModuleById: (moduleId: string, userRole: Role, userId?: string, mentorId?: string) => Promise<{
    data: {
        module: {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            contentUrl: string;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
        };
    };
}>;
export declare const listModules: (filters: ListModulesQuery, userRole: Role, userId?: string, mentorId?: string, ipAddress?: string) => Promise<{
    data: {
        modules: {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            title: string;
            description: string | null;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
        }[];
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const updateModule: (moduleId: string, data: UpdateModuleInput, adminId: string, ipAddress?: string) => Promise<{
    data: {
        updatedModule: {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            contentUrl: string;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
        };
    };
    message: string;
}>;
export declare const deleteModule: (moduleId: string, adminId: string, ipAddress?: string, hardDelete?: boolean) => Promise<{
    data: {
        result: {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            contentUrl: string;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
        };
    };
    message: string;
}>;
export declare const toggleModuleStatus: (moduleId: string, adminId: string, ipAddress?: string) => Promise<{
    data: {
        updated: {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            contentUrl: string;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
        };
    };
    message: string;
}>;
export declare const getModulesForMentor: (mentorUserId: string, filters?: {
    type?: ExerciseType;
    difficulty?: string;
}, ipAddress?: string) => Promise<{
    data: {
        modules: {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            isActive: boolean;
            title: string;
            description: string | null;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
        }[];
    };
}>;
export declare const getModulesForStudent: (studentUserId: string, filters?: {
    type?: ExerciseType;
    difficulty?: string;
}, ipAddress?: string) => Promise<{
    data: {
        modulesWithProgress: {
            id: string;
            title: string;
            description: string | null;
            type: import(".prisma/client").$Enums.ExerciseType;
            difficulty: string;
            estimatedDuration: number | null;
            orderIndex: number;
            progress: {
                score: number | null;
                completedAt: Date | null;
                timeSpent: number | null;
                isCompleted: boolean;
            } | null;
        }[];
    };
}>;
//# sourceMappingURL=module.service.d.ts.map