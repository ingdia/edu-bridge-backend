// src/utils/fileUpload.ts
import cloudinary, { FILE_CONFIGS } from '../config/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// ─────────────────────────────────────────────────────────────
// UPLOAD FILE TO CLOUDINARY
// ─────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
  resourceType: string;
}

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  fileType: 'ACADEMIC_REPORT' | 'AUDIO' | 'CV_DOCUMENT' | 'IMAGE'
): Promise<UploadResult> => {
  const config = FILE_CONFIGS[fileType];

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: config.folder,
        resource_type: config.resourceType,
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`, // Remove extension, add timestamp
        overwrite: false,
        unique_filename: true,
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes,
            resourceType: result.resource_type,
          });
        } else {
          reject(new Error('Upload failed: No result returned'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// ─────────────────────────────────────────────────────────────
// DELETE FILE FROM CLOUDINARY
// ─────────────────────────────────────────────────────────────

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('[CLOUDINARY_DELETE_ERROR]', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

// ─────────────────────────────────────────────────────────────
// GET FILE URL (for already uploaded files)
// ─────────────────────────────────────────────────────────────

export const getCloudinaryUrl = (publicId: string, resourceType: string = 'auto'): string => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    secure: true,
  });
};

// ─────────────────────────────────────────────────────────────
// VALIDATE FILE SIZE
// ─────────────────────────────────────────────────────────────

export const validateFileSize = (
  fileSize: number,
  maxSizeMB: number
): { valid: boolean; message?: string } => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (fileSize > maxSizeBytes) {
    return {
      valid: false,
      message: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
};

// ─────────────────────────────────────────────────────────────
// EXTRACT FILE EXTENSION
// ─────────────────────────────────────────────────────────────

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// ─────────────────────────────────────────────────────────────
// GENERATE UNIQUE FILENAME
// ─────────────────────────────────────────────────────────────

export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');

  return `${nameWithoutExt}-${timestamp}-${randomString}.${extension}`;
};
