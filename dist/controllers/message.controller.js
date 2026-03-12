"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationsListController = exports.deleteMessageController = exports.getUnreadCountController = exports.markAsReadController = exports.getConversationController = exports.getSentController = exports.getInboxController = exports.sendMessageController = void 0;
const message_service_1 = require("../services/message.service");
const message_validator_1 = require("../validators/message.validator");
// ─────────────────────────────────────────────────────────────
// SEND MESSAGE (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────
const sendMessageController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const validatedData = message_validator_1.sendMessageSchema.parse(req.body);
        const message = await (0, message_service_1.sendMessage)(userId, userRole, validatedData, ipAddress);
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { message },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendMessageController = sendMessageController;
// ─────────────────────────────────────────────────────────────
// GET INBOX MESSAGES
// ─────────────────────────────────────────────────────────────
const getInboxController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const query = message_validator_1.getMessagesQuerySchema.parse(req.query);
        const filters = {};
        if (query.isRead)
            filters.isRead = query.isRead === 'true';
        if (query.limit)
            filters.limit = parseInt(query.limit);
        if (query.page)
            filters.page = parseInt(query.page);
        const result = await (0, message_service_1.getMessages)(userId, filters);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getInboxController = getInboxController;
// ─────────────────────────────────────────────────────────────
// GET SENT MESSAGES
// ─────────────────────────────────────────────────────────────
const getSentController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { limit, page } = req.query;
        const filters = {};
        if (limit)
            filters.limit = parseInt(limit);
        if (page)
            filters.page = parseInt(page);
        const result = await (0, message_service_1.getSentMessages)(userId, filters);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSentController = getSentController;
// ─────────────────────────────────────────────────────────────
// GET CONVERSATION WITH SPECIFIC USER
// ─────────────────────────────────────────────────────────────
const getConversationController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { otherUserId } = req.params;
        const { limit, page } = req.query;
        const filters = {};
        if (limit)
            filters.limit = parseInt(limit);
        if (page)
            filters.page = parseInt(page);
        const result = await (0, message_service_1.getConversation)(userId, otherUserId, filters);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getConversationController = getConversationController;
// ─────────────────────────────────────────────────────────────
// MARK MESSAGES AS READ
// ─────────────────────────────────────────────────────────────
const markAsReadController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const validatedData = message_validator_1.markAsReadSchema.parse(req.body);
        const result = await (0, message_service_1.markAsRead)(userId, validatedData, ipAddress);
        res.status(200).json({
            success: true,
            message: `${result.count} message(s) marked as read`,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.markAsReadController = markAsReadController;
// ─────────────────────────────────────────────────────────────
// GET UNREAD COUNT
// ─────────────────────────────────────────────────────────────
const getUnreadCountController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const result = await (0, message_service_1.getUnreadCount)(userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUnreadCountController = getUnreadCountController;
// ─────────────────────────────────────────────────────────────
// DELETE MESSAGE
// ─────────────────────────────────────────────────────────────
const deleteMessageController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { messageId } = req.params;
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        await (0, message_service_1.deleteMessage)(userId, messageId, ipAddress);
        res.status(200).json({
            success: true,
            message: 'Message deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMessageController = deleteMessageController;
// ─────────────────────────────────────────────────────────────
// GET CONVERSATIONS LIST
// ─────────────────────────────────────────────────────────────
const getConversationsListController = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const conversations = await (0, message_service_1.getConversationsList)(userId);
        res.status(200).json({
            success: true,
            data: { conversations },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getConversationsListController = getConversationsListController;
//# sourceMappingURL=message.controller.js.map