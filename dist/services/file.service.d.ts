export declare const generateCloudinarySignedUrl: (publicId: string, resourceType: string | undefined, expiresIn: number | undefined, userId: string) => Promise<{
    url: string;
    expiresAt: Date;
}>;
export declare const getAcademicReportFile: (reportId: string, userId: string, userRole: string) => Promise<{
    url: string;
    fileName: string;
    fileSize?: number;
    expiresAt: Date;
}>;
export declare const getAudioSubmissionFile: (submissionId: string, userId: string, userRole: string) => Promise<{
    url: string;
    fileName: string;
    duration?: number;
    expiresAt: Date;
}>;
export declare const getModuleAudioFile: (moduleId: string, userId: string) => Promise<{
    url: string;
    title: string;
    duration?: number;
    expiresAt: Date;
}>;
export declare const getCVFile: (cvId: string, userId: string, userRole: string) => Promise<{
    url: string;
    template: string;
    expiresAt: Date;
}>;
//# sourceMappingURL=file.service.d.ts.map