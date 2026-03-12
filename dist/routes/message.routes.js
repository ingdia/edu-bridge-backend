"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/message.routes.ts
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ─────────────────────────────────────────────────────────────
// MESSAGE ROUTES (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────
// Send a message (Students, Mentors, Admins)
router.post('/', auth_middleware_1.authenticate, message_controller_1.sendMessageController);
// Get inbox messages (all users)
router.get('/inbox', auth_middleware_1.authenticate, message_controller_1.getInboxController);
// Get sent messages (all users)
router.get('/sent', auth_middleware_1.authenticate, message_controller_1.getSentController);
// Get unread count (all users)
router.get('/unread-count', auth_middleware_1.authenticate, message_controller_1.getUnreadCountController);
// Get conversations list (all users)
router.get('/conversations', auth_middleware_1.authenticate, message_controller_1.getConversationsListController);
// Get conversation with specific user (all users)
router.get('/conversation/:otherUserId', auth_middleware_1.authenticate, message_controller_1.getConversationController);
// Mark messages as read (all users)
router.patch('/mark-read', auth_middleware_1.authenticate, message_controller_1.markAsReadController);
// Delete message (all users)
router.delete('/:messageId', auth_middleware_1.authenticate, message_controller_1.deleteMessageController);
exports.default = router;
//# sourceMappingURL=message.routes.js.map