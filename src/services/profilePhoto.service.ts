// src/services/profilePhoto.service.ts
import prisma from '../config/database';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/fileUpload';
import { logAudit } from '../utils/logger';
import type { Role } from '../utils/jwt';

const profileModels = {
  STUDENT: prisma.studentProfile,
  MENTOR: prisma.mentorProfile,
  ADMIN: prisma.adminProfile,
} as const;

export const uploadProfilePhoto = async (
  userId: string,
  role: Role,
  file: Express.Multer.File
): Promise<string> => {
  const result = await uploadToCloudinary(file, 'profile-photos');
  const model = profileModels[role];

  const profile = await model.findUnique({
    where: { userId },
    select: { profilePhotoUrl: true },
  });

  await model.update({
    where: { userId },
    data: { profilePhotoUrl: result.secure_url },
  });

  if (profile?.profilePhotoUrl) {
    try {
      await deleteFromCloudinary(profile.profilePhotoUrl);
    } catch (error) {
      console.error('Failed to delete old profile photo:', error);
    }
  }

  await logAudit(userId, 'PROFILE_PHOTO_UPLOADED', {
    role,
    photoUrl: result.secure_url,
  });

  return result.secure_url;
};

export const deleteProfilePhoto = async (userId: string, role: Role): Promise<void> => {
  const model = profileModels[role];

  const profile = await model.findUnique({
    where: { userId },
    select: { profilePhotoUrl: true },
  });

  await model.update({
    where: { userId },
    data: { profilePhotoUrl: null },
  });

  if (profile?.profilePhotoUrl) {
    await deleteFromCloudinary(profile.profilePhotoUrl);
  }

  await logAudit(userId, 'PROFILE_PHOTO_DELETED', { role });
};
