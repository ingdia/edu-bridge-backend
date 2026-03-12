// src/services/file.service.ts
import prisma from '../config/database';
import cloudinary from '../config/cloudinary';
import { logAudit } from '../utils/logger';

// ─────────────────────────────────────────────────────────────
// HELPER: CHECK MENTOR-STUDENT RELATIONSHIP
// ─────────────────────────────────────────────────────────────

const isMentorAssignedToStudent = async (mentorUserId: string, studentId: string): Promise<boolean> => {
  const mentorProfile = await prisma.mentorProfile.findUnique({
    where: { userId: mentorUserId },
  });

  if (!mentorProfile) return false;

  const assignment = await prisma.mentorshipSession.findFirst({
    where: {
      mentorId: mentorProfile.id,
      studentId,
      status: { in: ['SCHEDULED', 'COMPLETED'] },
    },
  });

  return !!assignment;
};

// ─────────────────────────────────────────────────────────────
// GENERATE CLOUDINARY SIGNED URL
// ─────────────────────────────────────────────────────────────

export const generateCloudinarySignedUrl = async (
  publicId: string,
  resourceType: string = 'auto',
  expiresIn: number = 3600,
  userId: string
): Promise<{ url: string; expiresAt: Date }> => {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    // Generate signed URL
    const signedUrl = cloudinary.utils.private_download_url(publicId, resourceType as any, {
      expires_at: expiresAt,
    });

    // Audit log
    await logAudit(userId, 'REPORT_VIEW', {
      action: 'signed_url_generated',
      publicId,
      expiresIn,
    });

    return {
      url: signedUrl,
      expiresAt: new Date(expiresAt * 1000),
    };
  } catch (error) {
    console.error('[SIGNED_URL_ERROR]', error);
    throw new Error('Failed to generate signed URL');
  }
};

// ─────────────────────────────────────────────────────────────
// GET ACADEMIC REPORT FILE
// ─────────────────────────────────────────────────────────────

export const getAcademicReportFile = async (
  reportId: string,
  userId: string,
  userRole: string
): Promise<{ url: string; fileName: string; fileSize?: number; expiresAt: Date }> => {
  // Fetch report
  const report = await prisma.academicReport.findUnique({
    where: { id: reportId },
    include: {
      student: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });

  if (!report) {
    throw new Error('Academic report not found');
  }

  // Access control
  if (userRole === 'STUDENT') {
    // Students can only access their own reports
    if (report.student.userId !== userId) {
      throw new Error('Unauthorized: You can only access your own reports');
    }
  } else if (userRole === 'MENTOR') {
    // Mentors can access assigned students' reports
    const isAssigned = await isMentorAssignedToStudent(userId, report.studentId);
    if (!isAssigned) {
      throw new Error('Unauthorized: You can only access reports of assigned students');
    }
  }
  // Admins can access all reports

  if (!report.fileUrl) {
    throw new Error('No file attached to this report');
  }

  // Extract public_id from Cloudinary URL
  const urlParts = report.fileUrl.split('/');
  const publicIdWithExt = urlParts.slice(-2).join('/');
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

  // Generate signed URL (expires in 1 hour)
  const { url, expiresAt } = await generateCloudinarySignedUrl(publicId, 'auto', 3600, userId);

  // Audit log
  await logAudit(userId, 'REPORT_VIEW', {
    reportId,
    studentId: report.studentId,
    action: 'downloaded',
  });

  return {
    url,
    fileName: report.fileName || 'academic-report.pdf',
    fileSize: report.fileSize || undefined,
    expiresAt,
  };
};

// ─────────────────────────────────────────────────────────────
// GET AUDIO SUBMISSION FILE
// ─────────────────────────────────────────────────────────────

export const getAudioSubmissionFile = async (
  submissionId: string,
  userId: string,
  userRole: string
): Promise<{ url: string; fileName: string; duration?: number; expiresAt: Date }> => {
  // Fetch submission
  const submission = await prisma.exerciseSubmission.findUnique({
    where: { id: submissionId },
    include: {
      student: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });

  if (!submission) {
    throw new Error('Submission not found');
  }

  if (submission.exerciseType !== 'SPEAKING') {
    throw new Error('This submission does not contain an audio file');
  }

  // Access control
  if (userRole === 'STUDENT') {
    // Students can only access their own submissions
    if (submission.student.userId !== userId) {
      throw new Error('Unauthorized: You can only access your own submissions');
    }
  } else if (userRole === 'MENTOR') {
    // Mentors can access assigned students' submissions
    const isAssigned = await isMentorAssignedToStudent(userId, submission.studentId);
    if (!isAssigned) {
      throw new Error('Unauthorized: You can only access submissions of assigned students');
    }
  }
  // Admins can access all submissions

  const content = submission.submissionContent as any;
  if (!content.audioUrl) {
    throw new Error('No audio file attached to this submission');
  }

  // Extract public_id from Cloudinary URL
  const urlParts = content.audioUrl.split('/');
  const publicIdWithExt = urlParts.slice(-2).join('/');
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

  // Generate signed URL (expires in 2 hours for audio playback)
  const { url, expiresAt } = await generateCloudinarySignedUrl(publicId, 'video', 7200, userId);

  // Audit log
  await logAudit(userId, 'SPEAKING_EXERCISE_SUBMITTED', {
    submissionId,
    studentId: submission.studentId,
    action: 'audio_accessed',
  });

  return {
    url,
    fileName: content.originalFilename || 'audio-recording.mp3',
    duration: content.recordingDuration,
    expiresAt,
  };
};

// ─────────────────────────────────────────────────────────────
// GET MODULE AUDIO FILE (LISTENING EXERCISES)
// ─────────────────────────────────────────────────────────────

export const getModuleAudioFile = async (
  moduleId: string,
  userId: string
): Promise<{ url: string; title: string; duration?: number; expiresAt: Date }> => {
  // Fetch module
  const module = await prisma.learningModule.findUnique({
    where: { id: moduleId },
  });

  if (!module) {
    throw new Error('Module not found');
  }

  if (module.type !== 'LISTENING') {
    throw new Error('This module does not contain an audio file');
  }

  if (!module.isActive) {
    throw new Error('This module is not currently active');
  }

  if (!module.contentUrl) {
    throw new Error('No audio file attached to this module');
  }

  // Extract public_id from Cloudinary URL
  const urlParts = module.contentUrl.split('/');
  const publicIdWithExt = urlParts.slice(-2).join('/');
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

  // Generate signed URL (expires in 4 hours for learning)
  const { url, expiresAt } = await generateCloudinarySignedUrl(publicId, 'video', 14400, userId);

  // Audit log
  await logAudit(userId, 'MODULE_VIEW', {
    moduleId,
    action: 'audio_accessed',
  });

  return {
    url,
    title: module.title,
    duration: module.estimatedDuration || undefined,
    expiresAt,
  };
};

// ─────────────────────────────────────────────────────────────
// GET CV FILE
// ─────────────────────────────────────────────────────────────

export const getCVFile = async (
  cvId: string,
  userId: string,
  userRole: string
): Promise<{ url: string; template: string; expiresAt: Date }> => {
  // Fetch CV
  const cv = await prisma.cV.findUnique({
    where: { id: cvId },
    include: {
      student: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });

  if (!cv) {
    throw new Error('CV not found');
  }

  // Access control
  if (userRole === 'STUDENT') {
    // Students can only access their own CV
    if (cv.student.userId !== userId) {
      throw new Error('Unauthorized: You can only access your own CV');
    }
  } else if (userRole === 'MENTOR') {
    // Mentors can access assigned students' CVs
    const isAssigned = await isMentorAssignedToStudent(userId, cv.studentId);
    if (!isAssigned && !cv.isSharedWithMentor) {
      throw new Error('Unauthorized: Student has not shared their CV with you');
    }
  }
  // Admins can access all CVs

  // Audit log
  await logAudit(userId, 'CV_UPDATE', {
    cvId,
    studentId: cv.studentId,
    action: 'viewed',
  });

  // Return CV content (stored as JSON)
  return {
    url: '', // CV is stored as JSON, not a file
    template: cv.template || 'standard',
    expiresAt: new Date(Date.now() + 3600000), // 1 hour
  };
};
