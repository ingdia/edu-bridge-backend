"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfilePhoto = exports.uploadProfilePhoto = void 0;
// src/services/profilePhoto.service.ts
const database_1 = __importDefault(require("../config/database"));
const fileUpload_1 = require("../utils/fileUpload");
const logger_1 = require("../utils/logger");
const uploadProfilePhoto = async (userId, role, file) => {
    const result = await (0, fileUpload_1.uploadToCloudinary)(file.buffer, file.originalname, 'IMAGE');
    let oldPhotoUrl = null;
    if (role === 'STUDENT') {
        const profile = await database_1.default.studentProfile.findUnique({
            where: { userId },
            select: { profilePhotoUrl: true },
        });
        oldPhotoUrl = profile?.profilePhotoUrl || null;
        await database_1.default.studentProfile.update({
            where: { userId },
            data: { profilePhotoUrl: result.url },
        });
    }
    else if (role === 'MENTOR') {
        const profile = await database_1.default.mentorProfile.findUnique({
            where: { userId },
            select: { profilePhotoUrl: true },
        });
        oldPhotoUrl = profile?.profilePhotoUrl || null;
        await database_1.default.mentorProfile.update({
            where: { userId },
            data: { profilePhotoUrl: result.url },
        });
    }
    else if (role === 'ADMIN') {
        const profile = await database_1.default.adminProfile.findUnique({
            where: { userId },
            select: { profilePhotoUrl: true },
        });
        oldPhotoUrl = profile?.profilePhotoUrl || null;
        await database_1.default.adminProfile.update({
            where: { userId },
            data: { profilePhotoUrl: result.url },
        });
    }
    if (oldPhotoUrl) {
        try {
            await (0, fileUpload_1.deleteFromCloudinary)(oldPhotoUrl);
        }
        catch (error) {
            console.error('Failed to delete old profile photo:', error);
        }
    }
    await (0, logger_1.logAudit)(userId, 'PROFILE_PHOTO_UPLOADED', {
        role,
        photoUrl: result.url,
    });
    return result.url;
};
exports.uploadProfilePhoto = uploadProfilePhoto;
const deleteProfilePhoto = async (userId, role) => {
    let photoUrl = null;
    if (role === 'STUDENT') {
        const profile = await database_1.default.studentProfile.findUnique({
            where: { userId },
            select: { profilePhotoUrl: true },
        });
        photoUrl = profile?.profilePhotoUrl || null;
        await database_1.default.studentProfile.update({
            where: { userId },
            data: { profilePhotoUrl: null },
        });
    }
    else if (role === 'MENTOR') {
        const profile = await database_1.default.mentorProfile.findUnique({
            where: { userId },
            select: { profilePhotoUrl: true },
        });
        photoUrl = profile?.profilePhotoUrl || null;
        await database_1.default.mentorProfile.update({
            where: { userId },
            data: { profilePhotoUrl: null },
        });
    }
    else if (role === 'ADMIN') {
        const profile = await database_1.default.adminProfile.findUnique({
            where: { userId },
            select: { profilePhotoUrl: true },
        });
        photoUrl = profile?.profilePhotoUrl || null;
        await database_1.default.adminProfile.update({
            where: { userId },
            data: { profilePhotoUrl: null },
        });
    }
    if (photoUrl) {
        await (0, fileUpload_1.deleteFromCloudinary)(photoUrl);
    }
    await (0, logger_1.logAudit)(userId, 'PROFILE_PHOTO_DELETED', { role });
};
exports.deleteProfilePhoto = deleteProfilePhoto;
//# sourceMappingURL=profilePhoto.service.js.map