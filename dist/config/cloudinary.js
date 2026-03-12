"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_CONFIGS = exports.CLOUDINARY_FOLDERS = void 0;
// src/config/cloudinary.ts
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
// ─────────────────────────────────────────────────────────────
// CLOUDINARY CONFIGURATION (SRS FR 5.1, NFR 8)
// ─────────────────────────────────────────────────────────────
cloudinary_1.v2.config({
    cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.env.CLOUDINARY_API_KEY,
    api_secret: env_1.env.CLOUDINARY_API_SECRET,
    secure: true, // Use HTTPS
});
// ─────────────────────────────────────────────────────────────
// FOLDER STRUCTURE
// ─────────────────────────────────────────────────────────────
exports.CLOUDINARY_FOLDERS = {
    ACADEMIC_REPORTS: 'edu-bridge/academic-reports',
    AUDIO_FILES: 'edu-bridge/audio-files',
    CV_DOCUMENTS: 'edu-bridge/cv-documents',
    PROFILE_PHOTOS: 'edu-bridge/profile-photos',
};
// ─────────────────────────────────────────────────────────────
// FILE TYPE CONFIGURATIONS
// ─────────────────────────────────────────────────────────────
exports.FILE_CONFIGS = {
    ACADEMIC_REPORT: {
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
        maxSizeMB: 10,
        folder: exports.CLOUDINARY_FOLDERS.ACADEMIC_REPORTS,
        resourceType: 'auto',
    },
    AUDIO: {
        allowedFormats: ['mp3', 'wav', 'm4a', 'ogg', 'webm'],
        maxSizeMB: 20,
        folder: exports.CLOUDINARY_FOLDERS.AUDIO_FILES,
        resourceType: 'video', // Cloudinary uses 'video' for audio files
    },
    CV_DOCUMENT: {
        allowedFormats: ['pdf', 'doc', 'docx'],
        maxSizeMB: 5,
        folder: exports.CLOUDINARY_FOLDERS.CV_DOCUMENTS,
        resourceType: 'auto',
    },
    IMAGE: {
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
        maxSizeMB: 5,
        folder: exports.CLOUDINARY_FOLDERS.PROFILE_PHOTOS,
        resourceType: 'image',
    },
};
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map