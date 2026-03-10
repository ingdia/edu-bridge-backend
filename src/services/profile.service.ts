// src/services/profile.service.ts
import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import type { UpdateProfileInput, MentorNotesInput } from '../validators/profile.validator';

// ─────────────────────────────────────────────────────────────
// GET STUDENT PROFILE (SRS FR 2, NFR 10)
// ─────────────────────────────────────────────────────────────

export const getStudentProfile = async (
  userId: string,
  requesterRole: string
): Promise<any> => {
  // NFR 10: Role-based data filtering
  const selectFields: any = {
    id: true,
    userId: true,
    fullName: true,
    dateOfBirth: true,
    nationalId: true,
    schoolName: true,
    gradeLevel: true,
    guardianName: true,
    guardianContact: true,
    relationship: true,
    homeAddress: true,
    district: true,
    province: true,
    createdAt: true,
    updatedAt: true,
  };

  // Only mentors and admins can see sensitive socio-economic data
  if (requesterRole === 'MENTOR' || requesterRole === 'ADMIN') {
    selectFields.familyIncome = true;
    selectFields.occupation = true;
    selectFields.livingConditions = true;
    selectFields.mentorNotes = true;
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: selectFields,
  });

  if (!profile) {
    throw new Error('Student profile not found');
  }

  return profile;
};

// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT PROFILE (SRS FR 2.1 - 2.4)
// ─────────────────────────────────────────────────────────────

export const updateStudentProfile = async (
  userId: string,
  data: UpdateProfileInput,
  requesterId: string,
  requesterRole: string,
  ipAddress?: string
): Promise<any> => {
  // NFR 10: Students can only update their own basic info
  // Mentors/Admins can update all fields including sensitive data
  const allowedFields: any = {
    fullName: data.fullName,
    schoolName: data.schoolName,
    gradeLevel: data.gradeLevel,
    guardianName: data.guardianName,
    guardianContact: data.guardianContact,
    relationship: data.relationship,
    homeAddress: data.homeAddress,
    district: data.district,
    province: data.province,
  };

  // Only mentors/admins can update sensitive socio-economic data
  if (requesterRole === 'MENTOR' || requesterRole === 'ADMIN') {
    allowedFields.familyIncome = data.familyIncome;
    allowedFields.occupation = data.occupation;
    allowedFields.livingConditions = data.livingConditions;
  }

  // Remove undefined values
  Object.keys(allowedFields).forEach(
    (key) => allowedFields[key] === undefined && delete allowedFields[key]
  );

  const profile = await prisma.studentProfile.update({
    where: { userId },
    data: allowedFields,
  });

  // NFR 5: Audit logging
  await logAudit(
    requesterId,
    'PROFILE_UPDATE',
    { userId, updatedFields: Object.keys(allowedFields) },
    ipAddress
  );

  return profile;
};

// ─────────────────────────────────────────────────────────────
// UPDATE MENTOR NOTES (SRS FR 2.5 - Confidential)
// ─────────────────────────────────────────────────────────────

export const updateMentorNotes = async (
  userId: string,
  data: MentorNotesInput,
  requesterId: string,
  requesterRole: string,
  ipAddress?: string
): Promise<any> => {
  // NFR 10: Only mentors and admins can add/edit confidential notes
  if (requesterRole !== 'MENTOR' && requesterRole !== 'ADMIN') {
    throw new Error('Unauthorized: Only mentors and administrators can add notes');
  }

  const profile = await prisma.studentProfile.update({
    where: { userId },
    data: { mentorNotes: data.mentorNotes },
  });

  // NFR 5: Audit logging for sensitive action
  await logAudit(
    requesterId,
    'PROFILE_UPDATE',
    { userId, action: 'mentor_notes_updated' },
    ipAddress
  );

  return profile;
};

// ─────────────────────────────────────────────────────────────
// GET ALL STUDENTS (ADMIN ONLY - SRS 2.3)
// ─────────────────────────────────────────────────────────────

export const getAllStudents = async (
  requesterId: string,
  filters?: { district?: string; gradeLevel?: string }
): Promise<any[]> => {
  const whereClause: any = {};

  if (filters?.district) {
    whereClause.district = filters.district;
  }

  if (filters?.gradeLevel) {
    whereClause.gradeLevel = filters.gradeLevel;
  }

  const students = await prisma.studentProfile.findMany({
    where: whereClause,
    select: {
      id: true,
      userId: true,
      fullName: true,
      schoolName: true,
      gradeLevel: true,
      district: true,
      createdAt: true,
      user: {
        select: {
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  // NFR 5: Audit logging
  await logAudit(requesterId, 'PROFILE_UPDATE', { action: 'viewed_all_students' });

  return students;
};