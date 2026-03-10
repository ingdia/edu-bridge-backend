// src/utils/logger.ts
import prisma from '../config/database';
import { Prisma } from '@prisma/client'; 

/**
 * AuditAction: Union type of all trackable user actions (SRS NFR 5: Auditability)
 * 
 * Naming convention: {ENTITY}_{ACTION} in UPPER_SNAKE_CASE
 * Examples: USER_LOGIN, PROFILE_UPDATE, MODULE_LIST
 * 
 * 🔹 When adding a new feature, add its actions here first.
 * 🔹 Keep this list in sync with your SRS Section 5 (NFR-5).
 */
export type AuditAction =
  // ─────────────────────────────────────────────────────────────
  // AUTHENTICATION (FR 1)
  // ─────────────────────────────────────────────────────────────
  | 'USER_REGISTER'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'PASSWORD_RESET'
  | 'TOKEN_REFRESH'

  // ─────────────────────────────────────────────────────────────
  // PROFILE MANAGEMENT (FR 2)
  // ─────────────────────────────────────────────────────────────
  | 'PROFILE_VIEW'
  | 'PROFILE_UPDATE'
  | 'MENTOR_NOTES_UPDATE'
  | 'STUDENT_LIST_VIEW'

  // ─────────────────────────────────────────────────────────────
  // LEARNING MODULES (FR 3-4) ← NEW SECTION
  // ─────────────────────────────────────────────────────────────
  | 'MODULE_LIST'           // User viewed list of learning modules
  | 'MODULE_VIEW'           // User viewed a single module's details
  | 'MODULE_START'          // User started an exercise
  | 'MODULE_COMPLETE'       // User completed an exercise
  | 'PROGRESS_SUBMIT'       // User submitted progress/score
  | 'PROGRESS_VIEW'         // User/mentor viewed progress data

  // ─────────────────────────────────────────────────────────────
  // ACADEMIC REPORTS (FR 5)
  // ─────────────────────────────────────────────────────────────
  | 'GRADE_UPDATE'
  | 'REPORT_UPLOAD'
  | 'REPORT_VIEW'

  // ─────────────────────────────────────────────────────────────
  // MENTORSHIP (FR 7)
  // ─────────────────────────────────────────────────────────────
  | 'SESSION_CREATE'
  | 'SESSION_UPDATE'
  | 'SESSION_CANCEL'
  | 'MENTOR_MESSAGE_SEND'

  // ─────────────────────────────────────────────────────────────
  // CAREER GUIDANCE (FR 8)
  // ─────────────────────────────────────────────────────────────
  | 'CV_CREATE'
  | 'CV_UPDATE'
  | 'APPLICATION_SUBMIT'
  | 'APPLICATION_UPDATE'
  | 'OPPORTUNITY_MATCH_VIEW'

  // src/utils/logger.ts - ADD these to your existing AuditAction union:

// ─────────────────────────────────────────────────────────────
// LEARNING MODULES (FR 3-4)
// ─────────────────────────────────────────────────────────────
| 'MODULE_CREATE'          // Admin created a new learning module
| 'MODULE_UPDATE'          // Admin updated module details
| 'MODULE_DELETE'          // Admin deactivated a module
| 'MODULE_STATUS_TOGGLE'   // Admin changed module active status
| 'MODULE_LIST'            // User viewed list of learning modules
| 'MODULE_VIEW'            // User viewed a single module's details
| 'MODULE_START'           // Student started an exercise
| 'MODULE_COMPLETE'        // Student completed an exercise
| 'PROGRESS_SUBMIT'        // Student submitted progress/score
| 'PROGRESS_VIEW' ;         // User/mentor viewed progress data
/**
 * Log an audit event to the database (SRS NFR 5: Auditability)
 * 
 * @param userId - ID of the user who performed the action
 * @param action - The audit action type (must be one of AuditAction)
 * @param details - Optional context object (stored as JSON in DB)
 * @param ipAddress - Optional client IP address for security tracking
 * 
 * @returns Promise<void> - Resolves when log is written (or fails silently)
 * 
 * ⚠️ Fail-safe: If logging fails, the error is caught and logged to console,
 * but the main request flow continues uninterrupted.
 */
export const logAudit = async (
  userId: string,
  action: AuditAction,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> => {
  try {
    // ✅ CORRECT: Cast details to Prisma.JsonValue for JSON field compatibility
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: (details || {}) as Prisma.InputJsonValue, // ✅ Cast for Prisma
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    // 🛡️ Never fail the main request due to audit logging issues
    console.error('[AUDIT_LOG_ERROR]', {
      message: 'Failed to write audit log',
      action,
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * Helper: Batch log multiple audit events (optional utility for future use)
 * Useful for bulk operations like "imported 50 student grades"
 */
export const logAuditBatch = async (
  entries: Array<{
    userId: string;
    action: AuditAction;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }>
): Promise<void> => {
  try {
    if (entries.length === 0) return;
    
    // ✅ CORRECT: Map entries with proper JsonValue casting for Prisma
    await prisma.auditLog.createMany({
      data: entries.map(({ userId, action, details, ipAddress }) => ({
        userId,
        action,
        details: (details || {}) as Prisma.InputJsonValue, // ✅ Cast for Prisma
        ipAddress: ipAddress || null,
      })),
    });
  } catch (error) {
    console.error('[AUDIT_LOG_BATCH_ERROR]', error);
  }
};