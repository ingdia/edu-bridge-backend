import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createNotificationSchema,
  updateNotificationSchema,
  getNotificationsQuerySchema,
  bulkNotificationSchema,
} from '../validators/notification.validator';

const router = Router();

// Student + Mentor routes
router.get(
  '/my-notifications',
  authenticate,
  authorize('STUDENT', 'MENTOR'),
  validate(getNotificationsQuerySchema),
  notificationController.getMyNotifications.bind(notificationController)
);

router.get(
  '/unread-count',
  authenticate,
  authorize('STUDENT', 'MENTOR'),
  notificationController.getUnreadCount.bind(notificationController)
);

router.patch(
  '/:id/read',
  authenticate,
  authorize('STUDENT', 'MENTOR'),
  notificationController.markAsRead.bind(notificationController)
);

router.patch(
  '/mark-all-read',
  authenticate,
  authorize('STUDENT', 'MENTOR'),
  notificationController.markAllAsRead.bind(notificationController)
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('STUDENT', 'MENTOR'),
  validate(updateNotificationSchema),
  notificationController.updateNotificationStatus.bind(notificationController)
);

router.delete(
  '/:id',
  authenticate,
  authorize('STUDENT', 'MENTOR'),
  notificationController.deleteNotification.bind(notificationController)
);

// Admin routes
router.get(
  '/all',
  authenticate,
  authorize('ADMIN'),
  notificationController.getAllNotifications.bind(notificationController)
);

// Mentor/Admin routes
router.post(
  '/',
  authenticate,
  authorize('MENTOR', 'ADMIN'),
  validate(createNotificationSchema),
  notificationController.createNotification.bind(notificationController)
);

router.post(
  '/bulk',
  authenticate,
  authorize('ADMIN'),
  validate(bulkNotificationSchema),
  notificationController.createBulkNotifications.bind(notificationController)
);

export default router;
