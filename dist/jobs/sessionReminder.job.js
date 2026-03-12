"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAllCronJobs = exports.startDeadlineAlertJob = exports.startSessionReminderJob = void 0;
// src/jobs/sessionReminder.job.ts
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = __importDefault(require("../config/database"));
const email_service_1 = require("../services/email.service");
const logger_1 = require("../utils/logger");
// ─────────────────────────────────────────────────────────────
// SESSION REMINDER CRON JOB (SRS FR 7.2)
// ─────────────────────────────────────────────────────────────
/**
 * Send reminders for sessions scheduled in the next 24 hours
 * Runs daily at 9:00 AM
 */
const startSessionReminderJob = () => {
    // Run every day at 9:00 AM
    node_cron_1.default.schedule('0 9 * * *', async () => {
        console.log('[CRON] Running session reminder job...');
        try {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            // Find sessions scheduled in the next 24 hours that haven't been reminded
            const upcomingSessions = await database_1.default.mentorshipSession.findMany({
                where: {
                    scheduledFor: {
                        gte: now,
                        lte: tomorrow,
                    },
                    status: 'SCHEDULED',
                },
                include: {
                    student: {
                        include: {
                            user: {
                                select: { email: true },
                            },
                        },
                    },
                    mentor: {
                        include: {
                            user: {
                                select: { email: true },
                            },
                        },
                    },
                },
            });
            console.log(`[CRON] Found ${upcomingSessions.length} upcoming sessions`);
            let remindersSent = 0;
            for (const session of upcomingSessions) {
                try {
                    const sessionDate = new Date(session.scheduledFor).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                    const sessionTime = new Date(session.scheduledFor).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    // Send reminder to student
                    await (0, email_service_1.sendSessionReminder)(session.student.user.email, session.student.fullName, {
                        sessionDate,
                        sessionTime,
                        duration: session.duration,
                        location: session.location || 'Computer Lab',
                        mentorName: session.mentor.user.email, // You might want to add mentor name to schema
                        notes: session.notes || undefined,
                        isMentor: false,
                    });
                    // Send reminder to mentor
                    await (0, email_service_1.sendSessionReminder)(session.mentor.user.email, session.mentor.user.email, // You might want to add mentor name to schema
                    {
                        sessionDate,
                        sessionTime,
                        duration: session.duration,
                        location: session.location || 'Computer Lab',
                        studentName: session.student.fullName,
                        notes: session.notes || undefined,
                        isMentor: true,
                    });
                    remindersSent += 2;
                    // Log audit
                    await (0, logger_1.logAudit)('SYSTEM', 'SESSION_CREATE', {
                        sessionId: session.id,
                        studentId: session.studentId,
                        mentorId: session.mentorId,
                        action: 'reminder_sent',
                    });
                }
                catch (error) {
                    console.error(`[CRON] Failed to send reminder for session ${session.id}:`, error);
                }
            }
            console.log(`[CRON] Session reminder job completed. Sent ${remindersSent} reminders.`);
        }
        catch (error) {
            console.error('[CRON] Session reminder job failed:', error);
        }
    });
    console.log('[CRON] Session reminder job scheduled (runs daily at 9:00 AM)');
};
exports.startSessionReminderJob = startSessionReminderJob;
/**
 * Send deadline alerts for applications due in the next 3 days
 * Runs daily at 10:00 AM
 */
const startDeadlineAlertJob = () => {
    node_cron_1.default.schedule('0 10 * * *', async () => {
        console.log('[CRON] Running deadline alert job...');
        try {
            const now = new Date();
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
            // Find applications with deadlines in the next 3 days
            const upcomingDeadlines = await database_1.default.jobApplication.findMany({
                where: {
                    deadline: {
                        gte: now,
                        lte: threeDaysFromNow,
                    },
                    status: {
                        in: ['DRAFT', 'REVIEWING'],
                    },
                },
                include: {
                    student: {
                        include: {
                            user: {
                                select: { email: true },
                            },
                        },
                    },
                },
            });
            console.log(`[CRON] Found ${upcomingDeadlines.length} upcoming deadlines`);
            for (const application of upcomingDeadlines) {
                try {
                    const daysRemaining = Math.ceil((new Date(application.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    const deadlineDate = new Date(application.deadline).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                    // Import sendDeadlineAlert
                    const { sendDeadlineAlert } = await Promise.resolve().then(() => __importStar(require('../services/email.service')));
                    await sendDeadlineAlert(application.student.user.email, application.student.fullName, {
                        position: application.position,
                        organization: application.organization,
                        deadline: deadlineDate,
                        daysRemaining,
                        status: application.status,
                        isNotSubmitted: application.status === 'DRAFT',
                        applicationId: application.id,
                        platformUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
                    });
                    await (0, logger_1.logAudit)('SYSTEM', 'APPLICATION_UPDATE', {
                        applicationId: application.id,
                        studentId: application.studentId,
                        action: 'deadline_alert_sent',
                    });
                }
                catch (error) {
                    console.error(`[CRON] Failed to send deadline alert for application ${application.id}:`, error);
                }
            }
            console.log('[CRON] Deadline alert job completed.');
        }
        catch (error) {
            console.error('[CRON] Deadline alert job failed:', error);
        }
    });
    console.log('[CRON] Deadline alert job scheduled (runs daily at 10:00 AM)');
};
exports.startDeadlineAlertJob = startDeadlineAlertJob;
/**
 * Start all cron jobs
 */
const startAllCronJobs = () => {
    (0, exports.startSessionReminderJob)();
    (0, exports.startDeadlineAlertJob)();
    console.log('[CRON] All cron jobs started successfully');
};
exports.startAllCronJobs = startAllCronJobs;
//# sourceMappingURL=sessionReminder.job.js.map