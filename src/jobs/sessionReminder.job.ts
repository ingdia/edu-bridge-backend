// src/jobs/sessionReminder.job.ts
import cron from 'node-cron';
import prisma from '../config/database';
import { sendSessionReminder } from '../services/email.service';
import { logAudit } from '../utils/logger';

// ─────────────────────────────────────────────────────────────
// SESSION REMINDER CRON JOB (SRS FR 7.2)
// ─────────────────────────────────────────────────────────────

/**
 * Send reminders for sessions scheduled in the next 24 hours
 * Runs daily at 9:00 AM
 */
export const startSessionReminderJob = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Running session reminder job...');

    try {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find sessions scheduled in the next 24 hours that haven't been reminded
      const upcomingSessions = await prisma.mentorshipSession.findMany({
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
          await sendSessionReminder(
            session.student.user.email,
            session.student.fullName,
            {
              sessionDate,
              sessionTime,
              duration: session.duration,
              location: session.location || 'Computer Lab',
              mentorName: session.mentor.user.email, // You might want to add mentor name to schema
              notes: session.notes || undefined,
              isMentor: false,
            }
          );

          // Send reminder to mentor
          await sendSessionReminder(
            session.mentor.user.email,
            session.mentor.user.email, // You might want to add mentor name to schema
            {
              sessionDate,
              sessionTime,
              duration: session.duration,
              location: session.location || 'Computer Lab',
              studentName: session.student.fullName,
              notes: session.notes || undefined,
              isMentor: true,
            }
          );

          remindersSent += 2;

          // Log audit
          await logAudit(
            'SYSTEM',
            'SESSION_CREATE',
            {
              sessionId: session.id,
              studentId: session.studentId,
              mentorId: session.mentorId,
              action: 'reminder_sent',
            }
          );
        } catch (error) {
          console.error(`[CRON] Failed to send reminder for session ${session.id}:`, error);
        }
      }

      console.log(`[CRON] Session reminder job completed. Sent ${remindersSent} reminders.`);
    } catch (error) {
      console.error('[CRON] Session reminder job failed:', error);
    }
  });

  console.log('[CRON] Session reminder job scheduled (runs daily at 9:00 AM)');
};

/**
 * Send deadline alerts for applications due in the next 3 days
 * Runs daily at 10:00 AM
 */
export const startDeadlineAlertJob = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log('[CRON] Running deadline alert job...');

    try {
      const now = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      // Find applications with deadlines in the next 3 days
      const upcomingDeadlines = await prisma.jobApplication.findMany({
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
          const daysRemaining = Math.ceil(
            (new Date(application.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          const deadlineDate = new Date(application.deadline!).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          // Import sendDeadlineAlert
          const { sendDeadlineAlert } = await import('../services/email.service');

          await sendDeadlineAlert(
            application.student.user.email,
            application.student.fullName,
            {
              position: application.position,
              organization: application.organization,
              deadline: deadlineDate,
              daysRemaining,
              status: application.status,
              isNotSubmitted: application.status === 'DRAFT',
              applicationId: application.id,
              platformUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
            }
          );

          await logAudit(
            'SYSTEM',
            'APPLICATION_UPDATE',
            {
              applicationId: application.id,
              studentId: application.studentId,
              action: 'deadline_alert_sent',
            }
          );
        } catch (error) {
          console.error(`[CRON] Failed to send deadline alert for application ${application.id}:`, error);
        }
      }

      console.log('[CRON] Deadline alert job completed.');
    } catch (error) {
      console.error('[CRON] Deadline alert job failed:', error);
    }
  });

  console.log('[CRON] Deadline alert job scheduled (runs daily at 10:00 AM)');
};

/**
 * Start all cron jobs
 */
export const startAllCronJobs = () => {
  startSessionReminderJob();
  startDeadlineAlertJob();
  console.log('[CRON] All cron jobs started successfully');
};
