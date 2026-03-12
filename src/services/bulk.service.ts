// src/services/bulk.service.ts
import prisma from '../config/database';
import { Prisma } from '@prisma/client';
import { logAuditBatch } from '../utils/logger';
import { hashPassword } from '../utils/password';
import { notificationService } from './notification.service';

// ─────────────────────────────────────────────────────────────
// BULK IMPORT STUDENTS
// ─────────────────────────────────────────────────────────────

export interface BulkStudentData {
  fullName: string;
  email: string;
  dateOfBirth: string;
  nationalId: string;
  gradeLevel: string;
  schoolName?: string;
  guardianName?: string;
  guardianContact?: string;
  district?: string;
  province?: string;
}

export const bulkImportStudents = async (
  students: BulkStudentData[],
  adminId: string
): Promise<{ success: number; failed: number; errors: any[] }> => {
  let successCount = 0;
  let failedCount = 0;
  const errors: any[] = [];
  const auditEntries: any[] = [];

  for (const studentData of students) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: studentData.email },
      });

      if (existingUser) {
        errors.push({
          email: studentData.email,
          error: 'User already exists',
        });
        failedCount++;
        continue;
      }

      // Generate default password (can be changed later)
      const defaultPassword = await hashPassword('Student@123');

      // Create user and student profile in transaction
      await prisma.$transaction(async (tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
        const user = await tx.user.create({
          data: {
            email: studentData.email,
            password: defaultPassword,
            role: 'STUDENT',
          },
        });

        await tx.studentProfile.create({
          data: {
            userId: user.id,
            fullName: studentData.fullName,
            dateOfBirth: new Date(studentData.dateOfBirth),
            nationalId: studentData.nationalId,
            gradeLevel: studentData.gradeLevel,
            schoolName: studentData.schoolName || 'GS Ruyenzi',
            guardianName: studentData.guardianName,
            guardianContact: studentData.guardianContact,
            district: studentData.district,
            province: studentData.province,
          },
        });
      });

      successCount++;

      // Add to audit log batch
      auditEntries.push({
        userId: adminId,
        action: 'USER_REGISTER',
        details: { email: studentData.email, bulkImport: true },
      });
    } catch (error) {
      errors.push({
        email: studentData.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      failedCount++;
    }
  }

  // Batch audit logging
  if (auditEntries.length > 0) {
    await logAuditBatch(auditEntries);
  }

  return {
    success: successCount,
    failed: failedCount,
    errors,
  };
};

// ─────────────────────────────────────────────────────────────
// BULK GRADE ENTRY
// ─────────────────────────────────────────────────────────────

export interface BulkGradeData {
  studentId: string;
  term: string;
  year: number;
  subjects: Record<string, number>;
  overallGrade?: string;
  remarks?: string;
}

export const bulkGradeEntry = async (
  grades: BulkGradeData[],
  adminId: string
): Promise<{ success: number; failed: number; errors: any[] }> => {
  let successCount = 0;
  let failedCount = 0;
  const errors: any[] = [];
  const auditEntries: any[] = [];

  for (const gradeData of grades) {
    try {
      // Verify student exists
      const student = await prisma.studentProfile.findUnique({
        where: { id: gradeData.studentId },
      });

      if (!student) {
        errors.push({
          studentId: gradeData.studentId,
          error: 'Student not found',
        });
        failedCount++;
        continue;
      }

      // Create academic report
      await prisma.academicReport.create({
        data: {
          studentId: gradeData.studentId,
          term: gradeData.term,
          year: gradeData.year,
          subjects: gradeData.subjects,
          overallGrade: gradeData.overallGrade,
          remarks: gradeData.remarks,
          fileUrl: '',
          enteredBy: adminId,
        },
      });

      successCount++;

      // Add to audit log batch
      auditEntries.push({
        userId: adminId,
        action: 'ACADEMIC_REPORT_MANUAL_ENTRY',
        details: { studentId: gradeData.studentId, term: gradeData.term, year: gradeData.year },
      });
    } catch (error) {
      errors.push({
        studentId: gradeData.studentId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      failedCount++;
    }
  }

  // Batch audit logging
  if (auditEntries.length > 0) {
    await logAuditBatch(auditEntries);
  }

  return {
    success: successCount,
    failed: failedCount,
    errors,
  };
};

// ─────────────────────────────────────────────────────────────
// BULK SEND NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

export interface BulkNotificationData {
  recipientIds: string[];
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  sendEmail?: boolean;
}

export const bulkSendNotifications = async (
  data: BulkNotificationData,
  senderId: string
): Promise<{ success: number; failed: number }> => {
  try {
    const notifications = await notificationService.createBulkNotifications(
      data.recipientIds,
      {
        type: data.type as any,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        sendEmail: data.sendEmail,
        sentByAdminId: senderId,
      }
    );

    // Audit log
    await logAuditBatch(
      data.recipientIds.map((recipientId) => ({
        userId: senderId,
        action: 'NOTIFICATION_CREATED',
        details: { recipientId, type: data.type, bulkSend: true },
      }))
    );

    return {
      success: notifications.length,
      failed: 0,
    };
  } catch (error) {
    console.error('[BULK_NOTIFICATION_ERROR]', error);
    return {
      success: 0,
      failed: data.recipientIds.length,
    };
  }
};

// ─────────────────────────────────────────────────────────────
// BULK UPDATE USER STATUS
// ─────────────────────────────────────────────────────────────

export const bulkUpdateUserStatus = async (
  userIds: string[],
  isActive: boolean,
  adminId: string
): Promise<{ success: number }> => {
  const result = await prisma.user.updateMany({
    where: { id: { in: userIds } },
    data: { isActive },
  });

  // Audit log
  await logAuditBatch(
    userIds.map((userId) => ({
      userId: adminId,
      action: 'USER_REGISTER',
      details: { targetUserId: userId, isActive, bulkUpdate: true },
    }))
  );

  return { success: result.count };
};
