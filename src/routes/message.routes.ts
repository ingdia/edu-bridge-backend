// src/routes/message.routes.ts
import { Router } from 'express';
import {
  sendMessageController,
  getInboxController,
  getSentController,
  getConversationController,
  markAsReadController,
  getUnreadCountController,
  deleteMessageController,
  getConversationsListController,
} from '../controllers/message.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// ─────────────────────────────────────────────────────────────
// MESSAGE ROUTES (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────

// Send a message (Students, Mentors, Admins)
router.post('/', authenticate, sendMessageController);

// Get inbox messages (all users)
router.get('/inbox', authenticate, getInboxController);

// Get sent messages (all users)
router.get('/sent', authenticate, getSentController);

// Get unread count (all users)
router.get('/unread-count', authenticate, getUnreadCountController);

// Get conversations list (all users)
router.get('/conversations', authenticate, getConversationsListController);

// Get conversation with specific user (all users)
router.get('/conversation/:otherUserId', authenticate, getConversationController);

// Mark messages as read (all users)
router.patch('/mark-read', authenticate, markAsReadController);

// Delete message (all users)
router.delete('/:messageId', authenticate, deleteMessageController);

export default router;
