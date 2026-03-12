import { v2 as cloudinary } from 'cloudinary';
export declare const CLOUDINARY_FOLDERS: {
    ACADEMIC_REPORTS: string;
    AUDIO_FILES: string;
    CV_DOCUMENTS: string;
    PROFILE_PHOTOS: string;
};
export declare const FILE_CONFIGS: {
    ACADEMIC_REPORT: {
        allowedFormats: string[];
        maxSizeMB: number;
        folder: string;
        resourceType: "auto";
    };
    AUDIO: {
        allowedFormats: string[];
        maxSizeMB: number;
        folder: string;
        resourceType: "video";
    };
    CV_DOCUMENT: {
        allowedFormats: string[];
        maxSizeMB: number;
        folder: string;
        resourceType: "auto";
    };
    IMAGE: {
        allowedFormats: string[];
        maxSizeMB: number;
        folder: string;
        resourceType: "image";
    };
};
export default cloudinary;
//# sourceMappingURL=cloudinary.d.ts.map