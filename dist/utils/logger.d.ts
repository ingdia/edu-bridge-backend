/**
 * AuditAction: Union type of all trackable user actions (SRS NFR 5: Auditability)
 *
 * Naming convention: {ENTITY}_{ACTION} in UPPER_SNAKE_CASE
 * Examples: USER_LOGIN, PROFILE_UPDATE, MODULE_LIST
 *
 * 🔹 When adding a new feature, add its actions here first.
 * 🔹 Keep this list in sync with your SRS Section 5 (NFR-5).
 */
export type AuditAction = 'USER_REGISTER' | 'USER_LOGIN' | 'USER_LOGOUT' | 'PASSWORD_RESET' | 'TOKEN_REFRESH' | 'PROFILE_VIEW' | 'PROFILE_UPDATE' | 'MENTOR_NOTES_UPDATE' | 'STUDENT_LIST_VIEW' | 'MODULE_LIST' | 'MODULE_VIEW' | 'MODULE_START' | 'MODULE_COMPLETE' | 'PROGRESS_SUBMIT' | 'PROGRESS_VIEW' | 'EXERCISE_SUBMITTED' | 'SPEAKING_EXERCISE_SUBMITTED' | 'MENTOR_SUBMISSIONS_VIEWED' | 'SUBMISSION_EVALUATED' | 'EXERCISE_SUBMITTED' | 'SPEAKING_EXERCISE_SUBMITTED' | 'MENTOR_SUBMISSIONS_VIEWED' | 'SUBMISSION_EVALUATED' | 'ACADEMIC_REPORT_UPLOAD' | 'ACADEMIC_REPORT_MANUAL_ENTRY' | 'GRADE_UPDATE' | 'REPORT_UPLOAD' | 'REPORT_VIEW' | 'SESSION_CREATE' | 'SESSION_UPDATE' | 'SESSION_RESCHEDULE' | 'SESSION_CANCEL' | 'MENTOR_MESSAGE_SEND' | 'CV_CREATE' | 'CV_UPDATE' | 'APPLICATION_CREATE' | 'APPLICATION_SUBMIT' | 'APPLICATION_UPDATE' | 'OPPORTUNITY_MATCH_VIEW' | 'OPPORTUNITY_CREATED' | 'OPPORTUNITY_UPDATED' | 'OPPORTUNITY_DELETED' | 'OPPORTUNITY_CREATED' | 'OPPORTUNITY_UPDATED' | 'OPPORTUNITY_DELETED' | 'MODULE_CREATE' | 'MODULE_UPDATE' | 'MODULE_DELETE' | 'MODULE_STATUS_TOGGLE' | 'DIGITAL_LITERACY_LESSON_STARTED' | 'DIGITAL_LITERACY_LESSON_COMPLETED' | 'NOTIFICATION_CREATED' | 'BULK_NOTIFICATIONS_CREATED';
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
export declare const logAudit: (userId: string, action: AuditAction, details?: Record<string, unknown>, ipAddress?: string) => Promise<void>;
/**
 * Helper: Batch log multiple audit events (optional utility for future use)
 * Useful for bulk operations like "imported 50 student grades"
 */
export declare const logAuditBatch: (entries: Array<{
    userId: string;
    action: AuditAction;
    details?: Record<string, unknown>;
    ipAddress?: string;
}>) => Promise<void>;
//# sourceMappingURL=logger.d.ts.map