import { PrismaClient, NotificationType, NotificationStatus } from '@prisma/client';
import { sendEmail } from './email.service';

const prisma = new PrismaClient();

interface CreateNotificationData {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  sentByMentorId?: string;
  sentByAdminId?: string;
  sendEmail?: boolean;
}

export class NotificationService {
  // Create a single notification
  async createNotification(data: CreateNotificationData) {
    const notification = await prisma.notification.create({
      data: {
        recipientId: data.recipientId,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        metadata: data.metadata || undefined,
        sentByMentorId: data.sentByMentorId,
        sentByAdminId: data.sentByAdminId,
        status: 'UNREAD',
      },
      include: {
        recipient: {
          select: {
            id: true,
            fullName: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    // Send email if requested
    if (data.sendEmail) {
      await this.sendEmailNotification(notification);
    }

    return notification;
  }

  // Create bulk notifications
  async createBulkNotifications(
    recipientIds: string[],
    data: Omit<CreateNotificationData, 'recipientId'>
  ) {
    const notifications = await Promise.all(
      recipientIds.map((recipientId) =>
        this.createNotification({
          ...data,
          recipientId,
        })
      )
    );

    return notifications;
  }

  // Get notifications for a student
  async getStudentNotifications(
    studentId: string,
    filters?: {
      type?: NotificationType;
      status?: NotificationStatus;
      limit?: number;
    }
  ) {
    const where: any = { recipientId: studentId };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      include: {
        sentByMentor: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        sentByAdmin: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  }

  // Mark notification as read
  async markAsRead(notificationId: string, studentId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: studentId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });
  }

  // Mark all notifications as read
  async markAllAsRead(studentId: string) {
    return await prisma.notification.updateMany({
      where: {
        recipientId: studentId,
        status: 'UNREAD',
      },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    });
  }

  // Update notification status
  async updateNotificationStatus(
    notificationId: string,
    studentId: string,
    status: NotificationStatus
  ) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: studentId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status,
        ...(status === 'READ' && !notification.readAt ? { readAt: new Date() } : {}),
      },
    });
  }

  // Delete notification
  async deleteNotification(notificationId: string, studentId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: studentId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  // Get unread count
  async getUnreadCount(studentId: string) {
    return await prisma.notification.count({
      where: {
        recipientId: studentId,
        status: 'UNREAD',
      },
    });
  }

  // Send email notification
  private async sendEmailNotification(notification: any) {
    try {
      const recipient = notification.recipient;
      
      // Map notification type to email template
      let template = 'notification-generic';
      let subject = notification.title;
      
      // Prepare email data based on notification type
      const emailData: any = {
        recipientName: recipient.fullName,
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
        platformUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      };

      // Send email using email service
      await sendEmail({
        to: recipient.user.email,
        subject,
        template: 'notification-generic', // We'll create a generic template
        data: emailData,
      });

      // Mark email as sent
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
        },
      });

      console.log('[EMAIL_NOTIFICATION_SENT]', {
        to: recipient.user.email,
        type: notification.type,
      });
    } catch (error) {
      console.error('[EMAIL_NOTIFICATION_ERROR]', error);
      // Don't throw - email failures shouldn't break notification creation
    }
  }

  // Create session reminder notification
  async createSessionReminder(studentId: string, sessionDetails: any, mentorId?: string) {
    return await this.createNotification({
      recipientId: studentId,
      type: 'SESSION_REMINDER',
      title: 'Upcoming Mentorship Session',
      message: `You have a mentorship session scheduled for ${new Date(sessionDetails.scheduledFor).toLocaleString()}`,
      actionUrl: `/mentorship/sessions/${sessionDetails.id}`,
      metadata: sessionDetails,
      sentByMentorId: mentorId,
      sendEmail: true,
    });
  }

  // Create deadline alert notification
  async createDeadlineAlert(studentId: string, deadlineDetails: any, adminId?: string) {
    return await this.createNotification({
      recipientId: studentId,
      type: 'DEADLINE_ALERT',
      title: 'Application Deadline Approaching',
      message: `Deadline for ${deadlineDetails.position} at ${deadlineDetails.organization} is approaching`,
      actionUrl: `/career/applications/${deadlineDetails.id}`,
      metadata: deadlineDetails,
      sentByAdminId: adminId,
      sendEmail: true,
    });
  }

  // Create feedback received notification
  async createFeedbackNotification(studentId: string, feedbackDetails: any, mentorId?: string) {
    return await this.createNotification({
      recipientId: studentId,
      type: 'FEEDBACK_RECEIVED',
      title: 'New Feedback Received',
      message: `You have received feedback on your ${feedbackDetails.type}`,
      actionUrl: feedbackDetails.actionUrl,
      metadata: feedbackDetails,
      sentByMentorId: mentorId,
      sendEmail: true,
    });
  }
}

export const notificationService = new NotificationService();
