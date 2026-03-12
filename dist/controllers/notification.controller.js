"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const logger_1 = require("../utils/logger");
class NotificationController {
    // Create a notification (mentor/admin only)
    async createNotification(req, res) {
        try {
            const userId = req.user?.userId;
            const role = req.user?.role;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { recipientId, type, title, message, actionUrl, metadata, sendEmail } = req.body;
            const notification = await notification_service_1.notificationService.createNotification({
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
            await (0, logger_1.logAudit)(userId, 'NOTIFICATION_CREATED', {
                recipientId,
                type,
            });
            res.status(201).json({
                success: true,
                message: 'Notification created successfully',
                data: notification,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Create bulk notifications (admin only)
    async createBulkNotifications(req, res) {
        try {
            const userId = req.user?.userId;
            const role = req.user?.role;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { recipientIds, type, title, message, actionUrl, sendEmail } = req.body;
            const notifications = await notification_service_1.notificationService.createBulkNotifications(recipientIds, {
                type,
                title,
                message,
                actionUrl,
                sentByAdminId: role === 'ADMIN' ? userId : undefined,
                sendEmail,
            });
            await (0, logger_1.logAudit)(userId, 'BULK_NOTIFICATIONS_CREATED', {
                count: notifications.length,
                type,
            });
            res.status(201).json({
                success: true,
                message: `${notifications.length} notifications created successfully`,
                data: notifications,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get my notifications (student)
    async getMyNotifications(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { type, status, limit } = req.query;
            const filters = {};
            if (type)
                filters.type = type;
            if (status)
                filters.status = status;
            if (limit)
                filters.limit = parseInt(limit);
            const notifications = await notification_service_1.notificationService.getStudentNotifications(userId, filters);
            res.status(200).json({
                success: true,
                data: notifications,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get unread count
    async getUnreadCount(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const count = await notification_service_1.notificationService.getUnreadCount(userId);
            res.status(200).json({
                success: true,
                data: { unreadCount: count },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Mark notification as read
    async markAsRead(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { id } = req.params;
            const notification = await notification_service_1.notificationService.markAsRead(id, userId);
            res.status(200).json({
                success: true,
                message: 'Notification marked as read',
                data: notification,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Mark all as read
    async markAllAsRead(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            await notification_service_1.notificationService.markAllAsRead(userId);
            res.status(200).json({
                success: true,
                message: 'All notifications marked as read',
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Update notification status
    async updateNotificationStatus(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { id } = req.params;
            const { status } = req.body;
            const notification = await notification_service_1.notificationService.updateNotificationStatus(id, userId, status);
            res.status(200).json({
                success: true,
                message: 'Notification status updated',
                data: notification,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Delete notification
    async deleteNotification(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { id } = req.params;
            await notification_service_1.notificationService.deleteNotification(id, userId);
            res.status(200).json({
                success: true,
                message: 'Notification deleted successfully',
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
//# sourceMappingURL=notification.controller.js.map