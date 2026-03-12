"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationsList = exports.deleteMessage = exports.getUnreadCount = exports.markAsRead = exports.getConversation = exports.getSentMessages = exports.getMessages = exports.sendMessage = void 0;
// src/services/message.service.ts
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
// ─────────────────────────────────────────────────────────────
// SEND MESSAGE (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────
const sendMessage = async (senderUserId, senderRole, data, ipAddress) => {
    // Verify recipient exists
    const recipient = await database_1.default.user.findUnique({
        where: { id: data.recipientUserId },
        select: { id: true, role: true },
    });
    if (!recipient) {
        throw new Error('Recipient not found');
    }
    // Validate mentor-student relationship
    if (senderRole === 'STUDENT') {
        // Students can only message mentors
        if (recipient.role !== 'MENTOR' && recipient.role !== 'ADMIN') {
            throw new Error('Students can only message mentors or administrators');
        }
    }
    // Generate threadId if not provided (for new conversations)
    const threadId = data.threadId || `${[senderUserId, data.recipientUserId].sort().join('-')}`;
    const message = await database_1.default.message.create({
        data: {
            senderUserId,
            senderRole: senderRole,
            recipientUserId: data.recipientUserId,
            recipientRole: recipient.role,
            subject: data.subject,
            content: data.content,
            threadId,
            replyTo: data.replyTo,
        },
    });
    // Audit log
    await (0, logger_1.logAudit)(senderUserId, 'MESSAGE_SEND', {
        messageId: message.id,
        recipientUserId: data.recipientUserId,
        threadId,
    }, ipAddress);
    return message;
};
exports.sendMessage = sendMessage;
// ─────────────────────────────────────────────────────────────
// GET MESSAGES (Inbox/Sent)
// ─────────────────────────────────────────────────────────────
const getMessages = async (userId, filters) => {
    const limit = filters.limit || 50;
    const page = filters.page || 1;
    const skip = (page - 1) * limit;
    const whereClause = {
        recipientUserId: userId,
        isDeleted: false,
    };
    if (filters.conversationWith) {
        whereClause.OR = [
            { senderUserId: filters.conversationWith, recipientUserId: userId },
            { senderUserId: userId, recipientUserId: filters.conversationWith },
        ];
        delete whereClause.recipientUserId;
    }
    if (filters.isRead !== undefined) {
        whereClause.isRead = filters.isRead;
    }
    const [messages, total] = await Promise.all([
        database_1.default.message.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
            select: {
                id: true,
                senderUserId: true,
                senderRole: true,
                recipientUserId: true,
                recipientRole: true,
                subject: true,
                content: true,
                isRead: true,
                readAt: true,
                threadId: true,
                replyTo: true,
                createdAt: true,
            },
        }),
        database_1.default.message.count({ where: whereClause }),
    ]);
    return {
        messages,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getMessages = getMessages;
// ─────────────────────────────────────────────────────────────
// GET SENT MESSAGES
// ─────────────────────────────────────────────────────────────
const getSentMessages = async (userId, filters) => {
    const limit = filters.limit || 50;
    const page = filters.page || 1;
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
        database_1.default.message.findMany({
            where: {
                senderUserId: userId,
                isDeleted: false,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
            select: {
                id: true,
                recipientUserId: true,
                recipientRole: true,
                subject: true,
                content: true,
                isRead: true,
                readAt: true,
                threadId: true,
                createdAt: true,
            },
        }),
        database_1.default.message.count({
            where: { senderUserId: userId, isDeleted: false },
        }),
    ]);
    return {
        messages,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getSentMessages = getSentMessages;
// ─────────────────────────────────────────────────────────────
// GET CONVERSATION (Between two users)
// ─────────────────────────────────────────────────────────────
const getConversation = async (userId, otherUserId, filters) => {
    const limit = filters.limit || 50;
    const page = filters.page || 1;
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
        database_1.default.message.findMany({
            where: {
                OR: [
                    { senderUserId: userId, recipientUserId: otherUserId },
                    { senderUserId: otherUserId, recipientUserId: userId },
                ],
                isDeleted: false,
            },
            orderBy: { createdAt: 'asc' },
            take: limit,
            skip,
        }),
        database_1.default.message.count({
            where: {
                OR: [
                    { senderUserId: userId, recipientUserId: otherUserId },
                    { senderUserId: otherUserId, recipientUserId: userId },
                ],
                isDeleted: false,
            },
        }),
    ]);
    return {
        messages,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getConversation = getConversation;
// ─────────────────────────────────────────────────────────────
// MARK MESSAGES AS READ
// ─────────────────────────────────────────────────────────────
const markAsRead = async (userId, data, ipAddress) => {
    const updated = await database_1.default.message.updateMany({
        where: {
            id: { in: data.messageIds },
            recipientUserId: userId,
            isRead: false,
        },
        data: {
            isRead: true,
            readAt: new Date(),
        },
    });
    // Audit log
    await (0, logger_1.logAudit)(userId, 'MESSAGE_READ', {
        messageIds: data.messageIds,
        count: updated.count,
    }, ipAddress);
    return updated;
};
exports.markAsRead = markAsRead;
// ─────────────────────────────────────────────────────────────
// GET UNREAD COUNT
// ─────────────────────────────────────────────────────────────
const getUnreadCount = async (userId) => {
    const count = await database_1.default.message.count({
        where: {
            recipientUserId: userId,
            isRead: false,
            isDeleted: false,
        },
    });
    return { unreadCount: count };
};
exports.getUnreadCount = getUnreadCount;
// ─────────────────────────────────────────────────────────────
// DELETE MESSAGE (Soft delete)
// ─────────────────────────────────────────────────────────────
const deleteMessage = async (userId, messageId, ipAddress) => {
    // Verify user owns the message (either sender or recipient)
    const message = await database_1.default.message.findFirst({
        where: {
            id: messageId,
            OR: [{ senderUserId: userId }, { recipientUserId: userId }],
        },
    });
    if (!message) {
        throw new Error('Message not found or unauthorized');
    }
    const deleted = await database_1.default.message.update({
        where: { id: messageId },
        data: { isDeleted: true },
    });
    // Audit log
    await (0, logger_1.logAudit)(userId, 'MESSAGE_DELETE', { messageId }, ipAddress);
    return deleted;
};
exports.deleteMessage = deleteMessage;
// ─────────────────────────────────────────────────────────────
// GET CONVERSATIONS LIST (All unique conversations)
// ─────────────────────────────────────────────────────────────
const getConversationsList = async (userId) => {
    // Get all messages where user is sender or recipient
    const messages = await database_1.default.message.findMany({
        where: {
            OR: [{ senderUserId: userId }, { recipientUserId: userId }],
            isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        select: {
            senderUserId: true,
            recipientUserId: true,
            content: true,
            isRead: true,
            createdAt: true,
        },
    });
    // Group by conversation partner
    const conversationsMap = new Map();
    for (const msg of messages) {
        const partnerId = msg.senderUserId === userId ? msg.recipientUserId : msg.senderUserId;
        if (!conversationsMap.has(partnerId)) {
            conversationsMap.set(partnerId, {
                userId: partnerId,
                lastMessage: msg.content,
                lastMessageAt: msg.createdAt,
                unreadCount: 0,
            });
        }
        // Count unread messages from this partner
        if (msg.recipientUserId === userId && !msg.isRead) {
            conversationsMap.get(partnerId).unreadCount++;
        }
    }
    // Get user details for each conversation partner
    const conversations = await Promise.all(Array.from(conversationsMap.values()).map(async (conv) => {
        const user = await database_1.default.user.findUnique({
            where: { id: conv.userId },
            select: {
                id: true,
                email: true,
                role: true,
                studentProfile: {
                    select: { fullName: true },
                },
                mentorProfile: {
                    select: { id: true },
                },
            },
        });
        return {
            ...conv,
            userName: user?.studentProfile?.fullName || user?.email || 'Unknown',
            userRole: user?.role,
        };
    }));
    return conversations;
};
exports.getConversationsList = getConversationsList;
//# sourceMappingURL=message.service.js.map