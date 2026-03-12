"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionReminderService = void 0;
const database_1 = __importDefault(require("../config/database"));
const notification_service_1 = require("../services/notification.service");
/**
 * Automated Session Reminder Service (FR 7.2 + FR 9)
 *
 * This service sends automatic reminders for upcoming mentorship sessions.
 * Should be run as a scheduled job (cron) - e.g., every hour or twice daily.
 */
class SessionReminderService {
    /**
     * Send reminders for sessions happening in the next 24 hours
     * that haven't been reminded yet
     */
    static async sendUpcomingSessionReminders() {
        try {
            const now = new Date();
            const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            // Find all scheduled sessions in the next 24 hours
            const upcomingSessions = await database_1.default.mentorshipSession.findMany({
                where: {
                    status: 'SCHEDULED',
                    scheduledFor: {
                        gte: now,
                        lte: twentyFourHoursFromNow,
                    },
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            fullName: true,
                            user: { select: { email: true } },
                        },
                    },
                    mentor: {
                        select: {
                            id: true,
                            user: { select: { email: true } },
                        },
                    },
                },
            });
            console.log(`[SESSION_REMINDER] Found ${upcomingSessions.length} upcoming sessions`);
            // Send reminders to students
            for (const session of upcomingSessions) {
                // Check if reminder was already sent (check notifications)
                const existingReminder = await database_1.default.notification.findFirst({
                    where: {
                        recipientId: session.studentId,
                        type: 'SESSION_REMINDER',
                        metadata: {
                            path: ['sessionId'],
                            equals: session.id,
                        },
                        createdAt: {
                            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Within last 24 hours
                        },
                    },
                });
                if (!existingReminder) {
                    await notification_service_1.notificationService.createSessionReminder(session.studentId, {
                        id: session.id,
                        scheduledFor: session.scheduledFor,
                        duration: session.duration,
                        location: session.location,
                    }, session.mentorId);
                    console.log(`[SESSION_REMINDER] Sent reminder to student ${session.student.fullName} for session ${session.id}`);
                }
            }
            return {
                success: true,
                message: `Processed ${upcomingSessions.length} upcoming sessions`,
                remindersSent: upcomingSessions.length,
            };
        }
        catch (error) {
            console.error('[SESSION_REMINDER_ERROR]', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    /**
     * Send reminders for sessions happening in 1 hour (last-minute reminder)
     */
    static async sendImmediateSessionReminders() {
        try {
            const now = new Date();
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
            const fiftyMinutesFromNow = new Date(now.getTime() + 50 * 60 * 1000);
            const immediateSessions = await database_1.default.mentorshipSession.findMany({
                where: {
                    status: 'SCHEDULED',
                    scheduledFor: {
                        gte: fiftyMinutesFromNow,
                        lte: oneHourFromNow,
                    },
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                    mentor: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            for (const session of immediateSessions) {
                await notification_service_1.notificationService.createNotification({
                    recipientId: session.studentId,
                    type: 'SESSION_REMINDER',
                    title: 'Session Starting Soon!',
                    message: `Your mentorship session is starting in less than 1 hour at ${new Date(session.scheduledFor).toLocaleTimeString()}`,
                    actionUrl: `/mentorship/sessions/${session.id}`,
                    metadata: { sessionId: session.id, urgent: true },
                    sentByMentorId: session.mentorId,
                    sendEmail: true,
                });
            }
            return {
                success: true,
                message: `Sent ${immediateSessions.length} immediate reminders`,
            };
        }
        catch (error) {
            console.error('[IMMEDIATE_REMINDER_ERROR]', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    /**
     * Mark sessions as NO_SHOW if they're past scheduled time and still SCHEDULED
     */
    static async markMissedSessions() {
        try {
            const now = new Date();
            const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            const result = await database_1.default.mentorshipSession.updateMany({
                where: {
                    status: 'SCHEDULED',
                    scheduledFor: {
                        lte: twoHoursAgo,
                    },
                },
                data: {
                    status: 'NO_SHOW',
                    notes: 'Automatically marked as NO_SHOW - session time passed without completion',
                },
            });
            console.log(`[MISSED_SESSIONS] Marked ${result.count} sessions as NO_SHOW`);
            return {
                success: true,
                message: `Marked ${result.count} missed sessions`,
                count: result.count,
            };
        }
        catch (error) {
            console.error('[MISSED_SESSIONS_ERROR]', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
exports.SessionReminderService = SessionReminderService;
/**
 * Example usage in a cron job or scheduled task:
 *
 * // Run every hour
 * cron.schedule('0 * * * *', async () => {
 *   await SessionReminderService.sendUpcomingSessionReminders();
 *   await SessionReminderService.sendImmediateSessionReminders();
 * });
 *
 * // Run daily at midnight to clean up missed sessions
 * cron.schedule('0 0 * * *', async () => {
 *   await SessionReminderService.markMissedSessions();
 * });
 */
//# sourceMappingURL=sessionReminder.service.js.map