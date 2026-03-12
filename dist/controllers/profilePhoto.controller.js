"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfilePhotoController = exports.uploadProfilePhotoController = void 0;
const profilePhoto_service_1 = require("../services/profilePhoto.service");
const uploadProfilePhotoController = async (req, res) => {
    try {
        const { userId, role } = req.user;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const photoUrl = await (0, profilePhoto_service_1.uploadProfilePhoto)(userId, role, req.file);
        res.status(200).json({
            message: 'Profile photo uploaded successfully',
            photoUrl,
        });
    }
    catch (error) {
        console.error('Upload profile photo error:', error);
        res.status(500).json({ error: error.message || 'Failed to upload profile photo' });
    }
};
exports.uploadProfilePhotoController = uploadProfilePhotoController;
const deleteProfilePhotoController = async (req, res) => {
    try {
        const { userId, role } = req.user;
        await (0, profilePhoto_service_1.deleteProfilePhoto)(userId, role);
        res.status(200).json({
            message: 'Profile photo deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete profile photo error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete profile photo' });
    }
};
exports.deleteProfilePhotoController = deleteProfilePhotoController;
//# sourceMappingURL=profilePhoto.controller.js.map