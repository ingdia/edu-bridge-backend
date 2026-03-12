// src/controllers/profilePhoto.controller.ts
import type { Request, Response } from 'express';
import { uploadProfilePhoto, deleteProfilePhoto } from '../services/profilePhoto.service';
import type { AuthRequest } from '../middlewares/auth.middleware';

export const uploadProfilePhotoController = async (req: Request, res: Response) => {
  try {
    const { userId, role } = (req as AuthRequest).user;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoUrl = await uploadProfilePhoto(userId, role, req.file);

    res.status(200).json({
      message: 'Profile photo uploaded successfully',
      photoUrl,
    });
  } catch (error: any) {
    console.error('Upload profile photo error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload profile photo' });
  }
};

export const deleteProfilePhotoController = async (req: Request, res: Response) => {
  try {
    const { userId, role } = (req as AuthRequest).user;

    await deleteProfilePhoto(userId, role);

    res.status(200).json({
      message: 'Profile photo deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete profile photo error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete profile photo' });
  }
};
