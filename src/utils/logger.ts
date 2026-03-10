// src/utils/logger.ts
import prisma from '../config/database';

export type AuditAction =
  | 'USER_REGISTER'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'PASSWORD_RESET'
  | 'PROFILE_UPDATE'
  | 'GRADE_UPDATE'
  | 'SESSION_CREATE'
  | 'APPLICATION_SUBMIT';

/**
 * Log an audit event to the database (SRS NFR 5: Auditability)
 * @param userId - User who performed the action
 * @param action - Type of action
 * @param details - Additional context (optional)
 * @param ipAddress - Client IP address (optional)
 */
export const logAudit = async (
  userId: string,
  action: AuditAction,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details || {},
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error('[AUDIT LOG ERROR]', error);
  }
};