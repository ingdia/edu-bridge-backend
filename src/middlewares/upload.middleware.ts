// src/middlewares/upload.middleware.ts
import multer from 'multer';
import { Request } from 'express';
import { FILE_CONFIGS } from '../config/cloudinary';

// ─────────────────────────────────────────────────────────────
// MULTER CONFIGURATION (SRS FR 5.1, NFR 8)
// ─────────────────────────────────────────────────────────────

// Use memory storage (files stored in memory as Buffer)
// Cloudinary will receive the buffer directly
const storage = multer.memoryStorage();

// ─────────────────────────────────────────────────────────────
// FILE FILTER FUNCTION
// ─────────────────────────────────────────────────────────────

const createFileFilter = (allowedFormats: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Extract file extension
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      return cb(
        new Error(
          `Invalid file type. Allowed formats: ${allowedFormats.join(', ')}`
        )
      );
    }

    // Check mimetype as additional validation
    const allowedMimeTypes: { [key: string]: string[] } = {
      pdf: ['application/pdf'],
      jpg: ['image/jpeg'],
      jpeg: ['image/jpeg'],
      png: ['image/png'],
      gif: ['image/gif'],
      mp3: ['audio/mpeg', 'audio/mp3'],
      wav: ['audio/wav', 'audio/wave', 'audio/x-wav'],
      m4a: ['audio/mp4', 'audio/x-m4a'],
      ogg: ['audio/ogg'],
      webm: ['audio/webm'],
      doc: ['application/msword'],
      docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    };

    const validMimeTypes = allowedMimeTypes[fileExtension] || [];
    if (!validMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `Invalid file mimetype. Expected: ${validMimeTypes.join(', ')}, got: ${file.mimetype}`
        )
      );
    }

    cb(null, true);
  };
};

// ─────────────────────────────────────────────────────────────
// UPLOAD MIDDLEWARE INSTANCES
// ─────────────────────────────────────────────────────────────

// Academic Report Upload (PDF, JPEG, PNG - max 10MB)
export const uploadAcademicReport = multer({
  storage,
  limits: {
    fileSize: FILE_CONFIGS.ACADEMIC_REPORT.maxSizeMB * 1024 * 1024, // Convert MB to bytes
  },
  fileFilter: createFileFilter(FILE_CONFIGS.ACADEMIC_REPORT.allowedFormats),
}).single('file'); // Single file upload with field name 'file'

// Audio File Upload (MP3, WAV, M4A, OGG - max 20MB)
export const uploadAudio = multer({
  storage,
  limits: {
    fileSize: FILE_CONFIGS.AUDIO.maxSizeMB * 1024 * 1024,
  },
  fileFilter: createFileFilter(FILE_CONFIGS.AUDIO.allowedFormats),
}).single('audio'); // Single file upload with field name 'audio'

// CV/Document Upload (PDF, DOC, DOCX - max 5MB)
export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: FILE_CONFIGS.CV_DOCUMENT.maxSizeMB * 1024 * 1024,
  },
  fileFilter: createFileFilter(FILE_CONFIGS.CV_DOCUMENT.allowedFormats),
}).single('document'); // Single file upload with field name 'document'

// Profile Image Upload (JPG, PNG, GIF - max 5MB)
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: FILE_CONFIGS.IMAGE.maxSizeMB * 1024 * 1024,
  },
  fileFilter: createFileFilter(FILE_CONFIGS.IMAGE.allowedFormats),
}).single('image'); // Single file upload with field name 'image'

// ─────────────────────────────────────────────────────────────
// ERROR HANDLER MIDDLEWARE
// ─────────────────────────────────────────────────────────────

export const handleMulterError = (err: any, req: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the allowed limit',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed',
    });
  }

  next();
};
