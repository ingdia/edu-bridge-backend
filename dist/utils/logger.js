"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditBatch = exports.logAudit = void 0;
// src/utils/logger.ts
const database_1 = __importDefault(require("../config/database"));
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
const logAudit = async (userId, action, details, ipAddress) => {
    try {
        // ✅ CORRECT: Cast details to Prisma.JsonValue for JSON field compatibility
        await database_1.default.auditLog.create({
            data: {
                userId,
                action,
                details: (details || {}), // ✅ Cast for Prisma
                ipAddress: ipAddress || null,
            },
        });
    }
    catch (error) {
        // 🛡️ Never fail the main request due to audit logging issues
        console.error('[AUDIT_LOG_ERROR]', {
            message: 'Failed to write audit log',
            action,
            userId,
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.logAudit = logAudit;
/**
 * Helper: Batch log multiple audit events (optional utility for future use)
 * Useful for bulk operations like "imported 50 student grades"
 */
const logAuditBatch = async (entries) => {
    try {
        if (entries.length === 0)
            return;
        // ✅ CORRECT: Map entries with proper JsonValue casting for Prisma
        await database_1.default.auditLog.createMany({
            data: entries.map(({ userId, action, details, ipAddress }) => ({
                userId,
                action,
                details: (details || {}), // ✅ Cast for Prisma
                ipAddress: ipAddress || null,
            })),
        });
    }
    catch (error) {
        console.error('[AUDIT_LOG_BATCH_ERROR]', error);
    }
};
exports.logAuditBatch = logAuditBatch;
//# sourceMappingURL=logger.js.map