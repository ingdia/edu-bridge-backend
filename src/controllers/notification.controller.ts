import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { logAudit } from '../utils/logger';

export class NotificationController {
  // Create a notification (mentor/admin only)
  async createNotification(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { recipientId, type, title, message, actionUrl, metadata, sendEmail } = req.body;

      const notification = await notificationService.createNotification({
        recipientId,
        type,
        title,
        message,
        actionUrl,
        metadata,
        sentByMentorId: role === 'MENTOR' ? userId : undefined,
        sentByAdminId: role === 'ADMIN' ? userId : undefined,
        sendEmail,
      });

      await logAudit(userId, 'NOTIFICATION_CREATED', {
        recipientId,
        type,
      });

      res.status(201).json({
        success: true,
        message: 'Notification created successfully',
        data: notification,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Create bulk notifications (admin only)
  async createBulkNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { recipientIds, type, title, message, actionUrl, sendEmail } = req.body;

      const notifications = await notificationService.createBulkNotifications(recipientIds, {
        type,
        title,
        message,
        actionUrl,
        sentByAdminId: role === 'ADMIN' ? userId : undefined,
        sendEmail,
      });

      await logAudit(userId, 'BULK_NOTIFICATIONS_CREATED', {
        count: notifications.length,
        type,
      });

      res.status(201).json({
        success: true,
        message: `${notifications.length} notifications created successfully`,
        data: notifications,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get my notifications (student)
  async getMyNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { type, status, limit } = req.query;

      const filters: any = {};
      if (type) filters.type = type as string;
      if (status) filters.status = status as string;
      if (limit) filters.limit = parseInt(limit as string);

      const notifications = await notificationService.getStudentNotifications(userId, filters);

      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get unread count
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const count = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Mark notification as read
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;

      const notification = await notificationService.markAsRead(id, userId);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Mark all as read
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update notification status
  async updateNotificationStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      const { status } = req.body;

      const notification = await notificationService.updateNotificationStatus(id, userId, status);

      res.status(200).json({
        success: true,
        message: 'Notification status updated',
        data: notification,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;

      await notificationService.deleteNotification(id, userId);

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const notificationController = new NotificationController();
