"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueFilename = exports.getFileExtension = exports.validateFileSize = exports.getCloudinaryUrl = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
// src/utils/fileUpload.ts
const cloudinary_1 = __importStar(require("../config/cloudinary"));
const uploadToCloudinary = async (fileBuffer, fileName, fileType) => {
    const config = cloudinary_1.FILE_CONFIGS[fileType];
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: config.folder,
            resource_type: config.resourceType,
            public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`, // Remove extension, add timestamp
            overwrite: false,
            unique_filename: true,
        }, (error, result) => {
            if (error) {
                reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            else if (result) {
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    size: result.bytes,
                    resourceType: result.resource_type,
                });
            }
            else {
                reject(new Error('Upload failed: No result returned'));
            }
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
// ─────────────────────────────────────────────────────────────
// DELETE FILE FROM CLOUDINARY
// ─────────────────────────────────────────────────────────────
const deleteFromCloudinary = async (publicId, resourceType = 'auto') => {
    try {
        await cloudinary_1.default.uploader.destroy(publicId, { resource_type: resourceType });
    }
    catch (error) {
        console.error('[CLOUDINARY_DELETE_ERROR]', error);
        throw new Error('Failed to delete file from Cloudinary');
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
// ─────────────────────────────────────────────────────────────
// GET FILE URL (for already uploaded files)
// ─────────────────────────────────────────────────────────────
const getCloudinaryUrl = (publicId, resourceType = 'auto') => {
    return cloudinary_1.default.url(publicId, {
        resource_type: resourceType,
        secure: true,
    });
};
exports.getCloudinaryUrl = getCloudinaryUrl;
// ─────────────────────────────────────────────────────────────
// VALIDATE FILE SIZE
// ─────────────────────────────────────────────────────────────
const validateFileSize = (fileSize, maxSizeMB) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (fileSize > maxSizeBytes) {
        return {
            valid: false,
            message: `File size exceeds ${maxSizeMB}MB limit`,
        };
    }
    return { valid: true };
};
exports.validateFileSize = validateFileSize;
// ─────────────────────────────────────────────────────────────
// EXTRACT FILE EXTENSION
// ─────────────────────────────────────────────────────────────
const getFileExtension = (filename) => {
    return filename.split('.').pop()?.toLowerCase() || '';
};
exports.getFileExtension = getFileExtension;
// ─────────────────────────────────────────────────────────────
// GENERATE UNIQUE FILENAME
// ─────────────────────────────────────────────────────────────
const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = (0, exports.getFileExtension)(originalName);
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    return `${nameWithoutExt}-${timestamp}-${randomString}.${extension}`;
};
exports.generateUniqueFilename = generateUniqueFilename;
//# sourceMappingURL=fileUpload.js.map