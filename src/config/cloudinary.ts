// src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

// ─────────────────────────────────────────────────────────────
// CLOUDINARY CONFIGURATION (SRS FR 5.1, NFR 8)
// ─────────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// ─────────────────────────────────────────────────────────────
// FOLDER STRUCTURE
// ─────────────────────────────────────────────────────────────

export const CLOUDINARY_FOLDERS = {
  ACADEMIC_REPORTS: 'edu-bridge/academic-reports',
  AUDIO_FILES: 'edu-bridge/audio-files',
  CV_DOCUMENTS: 'edu-bridge/cv-documents',
  PROFILE_PHOTOS: 'edu-bridge/profile-photos',
};

// ─────────────────────────────────────────────────────────────
// FILE TYPE CONFIGURATIONS
// ─────────────────────────────────────────────────────────────

export const FILE_CONFIGS = {
  ACADEMIC_REPORT: {
    allowedFormats: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSizeMB: 10,
    folder: CLOUDINARY_FOLDERS.ACADEMIC_REPORTS,
    resourceType: 'auto' as const,
  },
  AUDIO: {
    allowedFormats: ['mp3', 'wav', 'm4a', 'ogg', 'webm'],
    maxSizeMB: 20,
    folder: CLOUDINARY_FOLDERS.AUDIO_FILES,
    resourceType: 'video' as const, // Cloudinary uses 'video' for audio files
  },
  CV_DOCUMENT: {
    allowedFormats: ['pdf', 'doc', 'docx'],
    maxSizeMB: 5,
    folder: CLOUDINARY_FOLDERS.CV_DOCUMENTS,
    resourceType: 'auto' as const,
  },
  IMAGE: {
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
    maxSizeMB: 5,
    folder: CLOUDINARY_FOLDERS.PROFILE_PHOTOS,
    resourceType: 'image' as const,
  },
};

export default cloudinary;
