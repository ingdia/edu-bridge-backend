"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScheduledNotifications = exports.sendSystemAnnouncement = exports.sendApplicationUpdateNotification = exports.sendFeedbackNotifications = exports.scheduleDeadlineAlerts = exports.scheduleSessionReminders = void 0;
// src/services/notificationScheduler.service.ts
const database_1 = __importDefault(require("../config/database"));
const notification_service_1 = require("./notification.service");
const logger_1 = require("../utils/logger");
// ─────────────────────────────────────────────────────────────
// SCHEDULE SESSION REMINDERS
// ─────────────────────────────────────────────────────────────
const scheduleSessionReminders = async () => {
    // Find sessions scheduled in the next 24 hours that haven't been reminded
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    const upcomingSessions = await database_1.default.mentorshipSession.findMany({
        where: {
            scheduledFor: {
                gte: new Date(),
                lte: tomorrow
            },
            status: 'SCHEDULED'
        },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    user: { select: { email: true } }
                }
            },
            mentor: {
                select: {
                    id: true,
                    user: { select: { email: true } }
                }
            }
        }
    });
    const reminders = [];
    for (const session of upcomingSessions) {
        try {
            // Create reminder for student
            const notification = await notification_service_1.notificationService.createSessionReminder(session.studentId, {
                id: session.id,
                scheduledFor: session.scheduledFor,
                location: session.location,
                duration: session.duration
            }, session.mentorId);
            reminders.push(notification);
            await (0, logger_1.logAudit)(session.mentorId, 'NOTIFICATION_CREATED', { type: 'SESSION_REMINDER', studentId: session.studentId, sessionId: session.id });
        }
        catch (error) {
            console.error('[SESSION_REMINDER_ERROR]', { sessionId: session.id, error });
        }
    }
    return reminders;
};
exports.scheduleSessionReminders = scheduleSessionReminders;
// ─────────────────────────────────────────────────────────────
// SCHEDULE DEADLINE ALERTS
// ─────────────────────────────────────────────────────────────
const scheduleDeadlineAlerts = async () => {
    // Find applications with deadlines in the next 7 days
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingDeadlines = await database_1.default.jobApplication.findMany({
        where: {
            deadline: {
                gte: new Date(),
                lte: nextWeek
            },
            status: {
                in: ['DRAFT', 'SUBMITTED']
            }
        },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    user: { select: { email: true } }
                }
            }
        }
    });
    const alerts = [];
    for (const application of upcomingDeadlines) {
        try {
            const daysUntilDeadline = Math.ceil((application.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const notification = await notification_service_1.notificationService.createDeadlineAlert(application.studentId, {
                id: application.id,
                position: application.position,
                organization: application.organization,
                deadline: application.deadline,
                daysRemaining: daysUntilDeadline
            });
            alerts.push(notification);
            await (0, logger_1.logAudit)(application.studentId, 'NOTIFICATION_CREATED', { type: 'DEADLINE_ALERT', applicationId: application.id });
        }
        catch (error) {
            console.error('[DEADLINE_ALERT_ERROR]', { applicationId: application.id, error });
        }
    }
    return alerts;
};
exports.scheduleDeadlineAlerts = scheduleDeadlineAlerts;
// ─────────────────────────────────────────────────────────────
// SEND FEEDBACK NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
const sendFeedbackNotifications = async (studentId, submissionId, mentorId) => {
    const submission = await database_1.default.exerciseSubmission.findUnique({
        where: { id: submissionId },
        include: {
            module: { select: { title: true, type: true } }
        }
    });
    if (!submission) {
        throw new Error('Submission not found');
    }
    const notification = await notification_service_1.notificationService.createFeedbackNotification(studentId, {
        type: submission.module.type,
        moduleTitle: submission.module.title,
        score: submission.score,
        actionUrl: `/learning/submissions/${submissionId}`
    }, mentorId);
    await (0, logger_1.logAudit)(mentorId, 'NOTIFICATION_CREATED', { type: 'FEEDBACK_RECEIVED', studentId, submissionId });
    return notification;
};
exports.sendFeedbackNotifications = sendFeedbackNotifications;
// ─────────────────────────────────────────────────────────────
// SEND APPLICATION UPDATE NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
const sendApplicationUpdateNotification = async (studentId, applicationId, updateType, adminId) => {
    const application = await database_1.default.jobApplication.findUnique({
        where: { id: applicationId }
    });
    if (!application) {
        throw new Error('Application not found');
    }
    const messages = {
        SUBMITTED: `Your application for ${application.position} at ${application.organization} has been submitted successfully`,
        ACCEPTED: `Congratulations! Your application for ${application.position} at ${application.organization} has been accepted`,
        REJECTED: `Your application for ${application.position} at ${application.organization} was not successful this time`,
        INTERVIEW: `You have been invited for an interview for ${application.position} at ${application.organization}`
    };
    const notification = await notification_service_1.notificationService.createNotification({
        recipientId: studentId,
        type: 'APPLICATION_UPDATE',
        title: `Application Update: ${application.position}`,
        message: messages[updateType],
        actionUrl: `/career/applications/${applicationId}`,
        metadata: { applicationId, updateType },
        sentByAdminId: adminId,
        sendEmail: true
    });
    await (0, logger_1.logAudit)(adminId || studentId, 'NOTIFICATION_CREATED', { type: 'APPLICATION_UPDATE', studentId, applicationId, updateType });
    return notification;
};
exports.sendApplicationUpdateNotification = sendApplicationUpdateNotification;
// ─────────────────────────────────────────────────────────────
// SEND SYSTEM ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────
const sendSystemAnnouncement = async (title, message, targetStudents, adminId, actionUrl) => {
    const notifications = await notification_service_1.notificationService.createBulkNotifications(targetStudents, {
        type: 'SYSTEM_ANNOUNCEMENT',
        title,
        message,
        actionUrl,
        sentByAdminId: adminId,
        sendEmail: true
    });
    await (0, logger_1.logAudit)(adminId, 'BULK_NOTIFICATIONS_CREATED', { type: 'SYSTEM_ANNOUNCEMENT', count: targetStudents.length });
    return notifications;
};
exports.sendSystemAnnouncement = sendSystemAnnouncement;
// ─────────────────────────────────────────────────────────────
// RUN ALL SCHEDULED NOTIFICATIONS (CRON JOB)
// ─────────────────────────────────────────────────────────────
const runScheduledNotifications = async () => {
    console.log('[NOTIFICATION_SCHEDULER] Running scheduled notifications...');
    try {
        const [sessionReminders, deadlineAlerts] = await Promise.all([
            (0, exports.scheduleSessionReminders)(),
            (0, exports.scheduleDeadlineAlerts)()
        ]);
        console.log('[NOTIFICATION_SCHEDULER] Completed:', {
            sessionReminders: sessionReminders.length,
            deadlineAlerts: deadlineAlerts.length
        });
        return {
            sessionReminders: sessionReminders.length,
            deadlineAlerts: deadlineAlerts.length
        };
    }
    catch (error) {
        console.error('[NOTIFICATION_SCHEDULER_ERROR]', error);
        throw error;
    }
};
exports.runScheduledNotifications = runScheduledNotifications;
//# sourceMappingURL=notificationScheduler.service.js.map