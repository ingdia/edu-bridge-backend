// src/routes/profilePhoto.routes.ts
import { Router } from 'express';
import {
  uploadProfilePhotoController,
  deleteProfilePhotoController,
} from '../controllers/profilePhoto.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadImage } from '../middlewares/upload.middleware';
import { uploadLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// POST /api/profile-photo - Upload profile photo
router.post(
  '/',
  authenticate,
  uploadLimiter,
  uploadImage,
  uploadProfilePhotoController
);

// DELETE /api/profile-photo - Delete profile photo
router.delete('/', authenticate, deleteProfilePhotoController);

export default router;
