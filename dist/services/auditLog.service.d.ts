interface AuditLogData {
    userId: string;
    action: string;
    entityType?: string;
    entityId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: any;
}
export declare const auditLogService: {
    log(data: AuditLogData): Promise<{
        id: string;
        userId: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    }>;
    getUserLogs(userId: string, limit?: number): Promise<({
        user: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        userId: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    })[]>;
    getActionLogs(action: string, startDate?: Date, endDate?: Date): Promise<({
        user: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        userId: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    })[]>;
    getEntityLogs(entityType: string, entityId: string): Promise<({
        user: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        userId: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    })[]>;
    getRecentLogs(limit?: number): Promise<({
        user: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        userId: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    })[]>;
};
export {};
//# sourceMappingURL=auditLog.service.d.ts.map