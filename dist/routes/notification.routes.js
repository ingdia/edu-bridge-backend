"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const notification_validator_1 = require("../validators/notification.validator");
const router = (0, express_1.Router)();
// Student routes
router.get('/my-notifications', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), (0, validate_middleware_1.validate)(notification_validator_1.getNotificationsQuerySchema), notification_controller_1.notificationController.getMyNotifications.bind(notification_controller_1.notificationController));
router.get('/unread-count', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), notification_controller_1.notificationController.getUnreadCount.bind(notification_controller_1.notificationController));
router.patch('/:id/read', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), notification_controller_1.notificationController.markAsRead.bind(notification_controller_1.notificationController));
router.patch('/mark-all-read', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), notification_controller_1.notificationController.markAllAsRead.bind(notification_controller_1.notificationController));
router.patch('/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), (0, validate_middleware_1.validate)(notification_validator_1.updateNotificationSchema), notification_controller_1.notificationController.updateNotificationStatus.bind(notification_controller_1.notificationController));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), notification_controller_1.notificationController.deleteNotification.bind(notification_controller_1.notificationController));
// Mentor/Admin routes
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('MENTOR', 'ADMIN'), (0, validate_middleware_1.validate)(notification_validator_1.createNotificationSchema), notification_controller_1.notificationController.createNotification.bind(notification_controller_1.notificationController));
router.post('/bulk', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), (0, validate_middleware_1.validate)(notification_validator_1.bulkNotificationSchema), notification_controller_1.notificationController.createBulkNotifications.bind(notification_controller_1.notificationController));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map