// src/controllers/message.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  sendMessage,
  getMessages,
  getSentMessages,
  getConversation,
  markAsRead,
  getUnreadCount,
  deleteMessage,
  getConversationsList,
} from '../services/message.service';
import {
  sendMessageSchema,
  getMessagesQuerySchema,
  markAsReadSchema,
} from '../validators/message.validator';

// ─────────────────────────────────────────────────────────────
// SEND MESSAGE (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────

export const sendMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const validatedData = sendMessageSchema.parse(req.body);

    const message = await sendMessage(userId, userRole, validatedData, ipAddress);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET INBOX MESSAGES
// ─────────────────────────────────────────────────────────────

export const getInboxController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const query = getMessagesQuerySchema.parse(req.query);

    const filters: any = {};
    if (query.isRead) filters.isRead = query.isRead === 'true';
    if (query.limit) filters.limit = parseInt(query.limit);
    if (query.page) filters.page = parseInt(query.page);

    const result = await getMessages(userId, filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET SENT MESSAGES
// ─────────────────────────────────────────────────────────────

export const getSentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { limit, page } = req.query;

    const filters: any = {};
    if (limit) filters.limit = parseInt(limit as string);
    if (page) filters.page = parseInt(page as string);

    const result = await getSentMessages(userId, filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET CONVERSATION WITH SPECIFIC USER
// ─────────────────────────────────────────────────────────────

export const getConversationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { otherUserId } = req.params;
    const { limit, page } = req.query;

    const filters: any = {};
    if (limit) filters.limit = parseInt(limit as string);
    if (page) filters.page = parseInt(page as string);

    const result = await getConversation(userId, otherUserId, filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// MARK MESSAGES AS READ
// ─────────────────────────────────────────────────────────────

export const markAsReadController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const validatedData = markAsReadSchema.parse(req.body);

    const result = await markAsRead(userId, validatedData, ipAddress);

    res.status(200).json({
      success: true,
      message: `${result.count} message(s) marked as read`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET UNREAD COUNT
// ─────────────────────────────────────────────────────────────

export const getUnreadCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    const result = await getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE MESSAGE
// ─────────────────────────────────────────────────────────────

export const deleteMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { messageId } = req.params;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    await deleteMessage(userId, messageId, ipAddress);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET CONVERSATIONS LIST
// ─────────────────────────────────────────────────────────────

export const getConversationsListController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    const conversations = await getConversationsList(userId);

    res.status(200).json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    next(error);
  }
};
