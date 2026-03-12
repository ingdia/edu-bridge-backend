// src/services/notificationScheduler.service.ts
import prisma from '../config/database';
import { notificationService } from './notification.service';
import { logAudit } from '../utils/logger';

// ─────────────────────────────────────────────────────────────
// SCHEDULE SESSION REMINDERS
// ─────────────────────────────────────────────────────────────

export const scheduleSessionReminders = async () => {
  // Find sessions scheduled in the next 24 hours that haven't been reminded
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 24);

  const upcomingSessions = await prisma.mentorshipSession.findMany({
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
      const notification = await notificationService.createSessionReminder(
        session.studentId,
        {
          id: session.id,
          scheduledFor: session.scheduledFor,
          location: session.location,
          duration: session.duration
        },
        session.mentorId
      );

      reminders.push(notification);

      await logAudit(
        session.mentorId,
        'NOTIFICATION_CREATED',
        { type: 'SESSION_REMINDER', studentId: session.studentId, sessionId: session.id }
      );
    } catch (error) {
      console.error('[SESSION_REMINDER_ERROR]', { sessionId: session.id, error });
    }
  }

  return reminders;
};

// ─────────────────────────────────────────────────────────────
// SCHEDULE DEADLINE ALERTS
// ─────────────────────────────────────────────────────────────

export const scheduleDeadlineAlerts = async () => {
  // Find applications with deadlines in the next 7 days
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingDeadlines = await prisma.jobApplication.findMany({
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
      const daysUntilDeadline = Math.ceil(
        (application.deadline!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      const notification = await notificationService.createDeadlineAlert(
        application.studentId,
        {
          id: application.id,
          position: application.position,
          organization: application.organization,
          deadline: application.deadline,
          daysRemaining: daysUntilDeadline
        }
      );

      alerts.push(notification);

      await logAudit(
        application.studentId,
        'NOTIFICATION_CREATED',
        { type: 'DEADLINE_ALERT', applicationId: application.id }
      );
    } catch (error) {
      console.error('[DEADLINE_ALERT_ERROR]', { applicationId: application.id, error });
    }
  }

  return alerts;
};

// ─────────────────────────────────────────────────────────────
// SEND FEEDBACK NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

export const sendFeedbackNotifications = async (
  studentId: string,
  submissionId: string,
  mentorId: string
) => {
  const submission = await prisma.exerciseSubmission.findUnique({
    where: { id: submissionId },
    include: {
      module: { select: { title: true, type: true } }
    }
  });

  if (!submission) {
    throw new Error('Submission not found');
  }

  const notification = await notificationService.createFeedbackNotification(
    studentId,
    {
      type: submission.module.type,
      moduleTitle: submission.module.title,
      score: submission.score,
      actionUrl: `/learning/submissions/${submissionId}`
    },
    mentorId
  );

  await logAudit(
    mentorId,
    'NOTIFICATION_CREATED',
    { type: 'FEEDBACK_RECEIVED', studentId, submissionId }
  );

  return notification;
};

// ─────────────────────────────────────────────────────────────
// SEND APPLICATION UPDATE NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

export const sendApplicationUpdateNotification = async (
  studentId: string,
  applicationId: string,
  updateType: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'INTERVIEW',
  adminId?: string
) => {
  const application = await prisma.jobApplication.findUnique({
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

  const notification = await notificationService.createNotification({
    recipientId: studentId,
    type: 'APPLICATION_UPDATE',
    title: `Application Update: ${application.position}`,
    message: messages[updateType],
    actionUrl: `/career/applications/${applicationId}`,
    metadata: { applicationId, updateType },
    sentByAdminId: adminId,
    sendEmail: true
  });

  await logAudit(
    adminId || studentId,
    'NOTIFICATION_CREATED',
    { type: 'APPLICATION_UPDATE', studentId, applicationId, updateType }
  );

  return notification;
};

// ─────────────────────────────────────────────────────────────
// SEND SYSTEM ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────

export const sendSystemAnnouncement = async (
  title: string,
  message: string,
  targetStudents: string[],
  adminId: string,
  actionUrl?: string
) => {
  const notifications = await notificationService.createBulkNotifications(
    targetStudents,
    {
      type: 'SYSTEM_ANNOUNCEMENT',
      title,
      message,
      actionUrl,
      sentByAdminId: adminId,
      sendEmail: true
    }
  );

  await logAudit(
    adminId,
    'BULK_NOTIFICATIONS_CREATED',
    { type: 'SYSTEM_ANNOUNCEMENT', count: targetStudents.length }
  );

  return notifications;
};

// ─────────────────────────────────────────────────────────────
// RUN ALL SCHEDULED NOTIFICATIONS (CRON JOB)
// ─────────────────────────────────────────────────────────────

export const runScheduledNotifications = async () => {
  console.log('[NOTIFICATION_SCHEDULER] Running scheduled notifications...');

  try {
    const [sessionReminders, deadlineAlerts] = await Promise.all([
      scheduleSessionReminders(),
      scheduleDeadlineAlerts()
    ]);

    console.log('[NOTIFICATION_SCHEDULER] Completed:', {
      sessionReminders: sessionReminders.length,
      deadlineAlerts: deadlineAlerts.length
    });

    return {
      sessionReminders: sessionReminders.length,
      deadlineAlerts: deadlineAlerts.length
    };
  } catch (error) {
    console.error('[NOTIFICATION_SCHEDULER_ERROR]', error);
    throw error;
  }
};
