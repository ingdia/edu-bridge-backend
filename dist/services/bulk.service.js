"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateUserStatus = exports.bulkSendNotifications = exports.bulkGradeEntry = exports.bulkImportStudents = void 0;
// src/services/bulk.service.ts
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const password_1 = require("../utils/password");
const notification_service_1 = require("./notification.service");
const bulkImportStudents = async (students, adminId) => {
    let successCount = 0;
    let failedCount = 0;
    const errors = [];
    const auditEntries = [];
    for (const studentData of students) {
        try {
            // Check if user already exists
            const existingUser = await database_1.default.user.findUnique({
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
            const defaultPassword = await (0, password_1.hashPassword)('Student@123');
            // Create user and student profile in transaction
            await database_1.default.$transaction(async (tx) => {
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
        }
        catch (error) {
            errors.push({
                email: studentData.email,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            failedCount++;
        }
    }
    // Batch audit logging
    if (auditEntries.length > 0) {
        await (0, logger_1.logAuditBatch)(auditEntries);
    }
    return {
        success: successCount,
        failed: failedCount,
        errors,
    };
};
exports.bulkImportStudents = bulkImportStudents;
const bulkGradeEntry = async (grades, adminId) => {
    let successCount = 0;
    let failedCount = 0;
    const errors = [];
    const auditEntries = [];
    for (const gradeData of grades) {
        try {
            // Verify student exists
            const student = await database_1.default.studentProfile.findUnique({
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
            await database_1.default.academicReport.create({
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
        }
        catch (error) {
            errors.push({
                studentId: gradeData.studentId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            failedCount++;
        }
    }
    // Batch audit logging
    if (auditEntries.length > 0) {
        await (0, logger_1.logAuditBatch)(auditEntries);
    }
    return {
        success: successCount,
        failed: failedCount,
        errors,
    };
};
exports.bulkGradeEntry = bulkGradeEntry;
const bulkSendNotifications = async (data, senderId) => {
    try {
        const notifications = await notification_service_1.notificationService.createBulkNotifications(data.recipientIds, {
            type: data.type,
            title: data.title,
            message: data.message,
            actionUrl: data.actionUrl,
            sendEmail: data.sendEmail,
            sentByAdminId: senderId,
        });
        // Audit log
        await (0, logger_1.logAuditBatch)(data.recipientIds.map((recipientId) => ({
            userId: senderId,
            action: 'NOTIFICATION_CREATED',
            details: { recipientId, type: data.type, bulkSend: true },
        })));
        return {
            success: notifications.length,
            failed: 0,
        };
    }
    catch (error) {
        console.error('[BULK_NOTIFICATION_ERROR]', error);
        return {
            success: 0,
            failed: data.recipientIds.length,
        };
    }
};
exports.bulkSendNotifications = bulkSendNotifications;
// ─────────────────────────────────────────────────────────────
// BULK UPDATE USER STATUS
// ─────────────────────────────────────────────────────────────
const bulkUpdateUserStatus = async (userIds, isActive, adminId) => {
    const result = await database_1.default.user.updateMany({
        where: { id: { in: userIds } },
        data: { isActive },
    });
    // Audit log
    await (0, logger_1.logAuditBatch)(userIds.map((userId) => ({
        userId: adminId,
        action: 'USER_REGISTER',
        details: { targetUserId: userId, isActive, bulkUpdate: true },
    })));
    return { success: result.count };
};
exports.bulkUpdateUserStatus = bulkUpdateUserStatus;
//# sourceMappingURL=bulk.service.js.map