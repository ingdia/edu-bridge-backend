export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    size: number;
    resourceType: string;
}
export declare const uploadToCloudinary: (fileBuffer: Buffer, fileName: string, fileType: "ACADEMIC_REPORT" | "AUDIO" | "CV_DOCUMENT" | "IMAGE") => Promise<UploadResult>;
export declare const deleteFromCloudinary: (publicId: string, resourceType?: "image" | "video" | "raw" | "auto") => Promise<void>;
export declare const getCloudinaryUrl: (publicId: string, resourceType?: string) => string;
export declare const validateFileSize: (fileSize: number, maxSizeMB: number) => {
    valid: boolean;
    message?: string;
};
export declare const getFileExtension: (filename: string) => string;
export declare const generateUniqueFilename: (originalName: string) => string;
//# sourceMappingURL=fileUpload.d.ts.map