// src/services/profilePhoto.service.ts
import prisma from '../config/database';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/fileUpload';
import { logAudit } from '../utils/logger';
import type { Role } from '../utils/jwt';

export const uploadProfilePhoto = async (
  userId: string,
  role: Role,
  file: Express.Multer.File
): Promise<string> => {
  const result = await uploadToCloudinary(file.buffer, file.originalname, 'IMAGE');

  let oldPhotoUrl: string | null = null;

  if (role === 'STUDENT') {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { profilePhotoUrl: true },
    });
    oldPhotoUrl = profile?.profilePhotoUrl || null;

    await prisma.studentProfile.update({
      where: { userId },
      data: { profilePhotoUrl: result.url },
    });
  } else if (role === 'MENTOR') {
    const profile = await prisma.mentorProfile.findUnique({
      where: { userId },
      select: { profilePhotoUrl: true },
    });
    oldPhotoUrl = profile?.profilePhotoUrl || null;

    await prisma.mentorProfile.update({
      where: { userId },
      data: { profilePhotoUrl: result.url },
    });
  } else if (role === 'ADMIN') {
    const profile = await prisma.adminProfile.findUnique({
      where: { userId },
      select: { profilePhotoUrl: true },
    });
    oldPhotoUrl = profile?.profilePhotoUrl || null;

    await prisma.adminProfile.update({
      where: { userId },
      data: { profilePhotoUrl: result.url },
    });
  }

  if (oldPhotoUrl) {
    try {
      await deleteFromCloudinary(oldPhotoUrl);
    } catch (error) {
      console.error('Failed to delete old profile photo:', error);
    }
  }

  await logAudit(userId, 'PROFILE_PHOTO_UPLOADED', {
    role,
    photoUrl: result.url,
  });

  return result.url;
};

export const deleteProfilePhoto = async (userId: string, role: Role): Promise<void> => {
  let photoUrl: string | null = null;

  if (role === 'STUDENT') {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { profilePhotoUrl: true },
    });
    photoUrl = profile?.profilePhotoUrl || null;

    await prisma.studentProfile.update({
      where: { userId },
      data: { profilePhotoUrl: null },
    });
  } else if (role === 'MENTOR') {
    const profile = await prisma.mentorProfile.findUnique({
      where: { userId },
      select: { profilePhotoUrl: true },
    });
    photoUrl = profile?.profilePhotoUrl || null;

    await prisma.mentorProfile.update({
      where: { userId },
      data: { profilePhotoUrl: null },
    });
  } else if (role === 'ADMIN') {
    const profile = await prisma.adminProfile.findUnique({
      where: { userId },
      select: { profilePhotoUrl: true },
    });
    photoUrl = profile?.profilePhotoUrl || null;

    await prisma.adminProfile.update({
      where: { userId },
      data: { profilePhotoUrl: null },
    });
  }

  if (photoUrl) {
    await deleteFromCloudinary(photoUrl);
  }

  await logAudit(userId, 'PROFILE_PHOTO_DELETED', { role });
};
