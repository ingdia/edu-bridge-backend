export declare const healthMonitoringService: {
    checkDatabaseHealth(): Promise<{
        status: string;
        message: any;
    }>;
    checkCloudinaryHealth(): Promise<{
        status: string;
        message: any;
    }>;
    checkEmailServiceHealth(): Promise<{
        status: string;
        message: any;
    }>;
    getSystemMetrics(): Promise<{
        uptime: {
            seconds: number;
            formatted: string;
        };
        memory: {
            rss: string;
            heapUsed: string;
            heapTotal: string;
        };
        nodeVersion: string;
        platform: NodeJS.Platform;
    }>;
    getDataMetrics(): Promise<{
        totalUsers: number;
        totalStudents: number;
        totalMentors: number;
        totalModules: number;
        totalSessions: number;
        totalSubmissions: number;
        totalOpportunities: number;
    }>;
    getErrorMetrics(): Promise<{
        errors24h: number;
        accessDenied24h: number;
    }>;
    getFullHealthReport(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: {
                status: string;
                message: any;
            };
            cloudinary: {
                status: string;
                message: any;
            };
            email: {
                status: string;
                message: any;
            };
        };
        system: {
            uptime: {
                seconds: number;
                formatted: string;
            };
            memory: {
                rss: string;
                heapUsed: string;
                heapTotal: string;
            };
            nodeVersion: string;
            platform: NodeJS.Platform;
        };
        data: {
            totalUsers: number;
            totalStudents: number;
            totalMentors: number;
            totalModules: number;
            totalSessions: number;
            totalSubmissions: number;
            totalOpportunities: number;
        };
        errors: {
            errors24h: number;
            accessDenied24h: number;
        };
    }>;
};
//# sourceMappingURL=healthMonitoring.service.d.ts.map