// src/services/message.service.ts
import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { SendMessageInput, MarkAsReadInput } from '../validators/message.validator';

// ─────────────────────────────────────────────────────────────
// SEND MESSAGE (SRS FR 7.1)
// ─────────────────────────────────────────────────────────────

export const sendMessage = async (
  senderUserId: string,
  senderRole: string,
  data: SendMessageInput,
  ipAddress?: string
) => {
  // Verify recipient exists
  const recipient = await prisma.user.findUnique({
    where: { id: data.recipientUserId },
    select: { id: true, role: true },
  });

  if (!recipient) {
    throw new Error('Recipient not found');
  }

  // Validate messaging permissions
  if (senderRole === 'STUDENT') {
    // Students can only message mentors or admins
    if (recipient.role !== 'MENTOR' && recipient.role !== 'ADMIN') {
      throw new Error('Students can only message mentors or administrators');
    }
  }
  // Mentors can message students and admins — no restriction needed

  // Generate threadId if not provided (for new conversations)
  const threadId = data.threadId || `${[senderUserId, data.recipientUserId].sort().join('-')}`;

  const message = await prisma.message.create({
    data: {
      senderUserId,
      senderRole: senderRole as any,
      recipientUserId: data.recipientUserId,
      recipientRole: recipient.role,
      subject: data.subject,
      content: data.content,
      threadId,
      replyTo: data.replyTo,
    },
  });

  // Audit log
  await logAudit(
    senderUserId,
    'MESSAGE_SEND',
    {
      messageId: message.id,
      recipientUserId: data.recipientUserId,
      threadId,
    },
    ipAddress
  );

  return message;
};

// ─────────────────────────────────────────────────────────────
// GET MESSAGES (Inbox/Sent)
// ─────────────────────────────────────────────────────────────

export const getMessages = async (
  userId: string,
  filters: {
    conversationWith?: string;
    isRead?: boolean;
    limit?: number;
    page?: number;
  }
) => {
  const limit = filters.limit || 50;
  const page = filters.page || 1;
  const skip = (page - 1) * limit;

  const whereClause: any = {
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
    prisma.message.findMany({
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
    prisma.message.count({ where: whereClause }),
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

// ─────────────────────────────────────────────────────────────
// GET SENT MESSAGES
// ─────────────────────────────────────────────────────────────

export const getSentMessages = async (
  userId: string,
  filters: { limit?: number; page?: number }
) => {
  const limit = filters.limit || 50;
  const page = filters.page || 1;
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
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
    prisma.message.count({
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

// ─────────────────────────────────────────────────────────────
// GET CONVERSATION (Between two users)
// ─────────────────────────────────────────────────────────────

export const getConversation = async (
  userId: string,
  otherUserId: string,
  filters: { limit?: number; page?: number }
) => {
  const limit = filters.limit || 50;
  const page = filters.page || 1;
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
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
    prisma.message.count({
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

// ─────────────────────────────────────────────────────────────
// MARK MESSAGES AS READ
// ─────────────────────────────────────────────────────────────

export const markAsRead = async (
  userId: string,
  data: MarkAsReadInput,
  ipAddress?: string
) => {
  const updated = await prisma.message.updateMany({
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
  await logAudit(
    userId,
    'MESSAGE_READ',
    {
      messageIds: data.messageIds,
      count: updated.count,
    },
    ipAddress
  );

  return updated;
};

// ─────────────────────────────────────────────────────────────
// GET UNREAD COUNT
// ─────────────────────────────────────────────────────────────

export const getUnreadCount = async (userId: string) => {
  const count = await prisma.message.count({
    where: {
      recipientUserId: userId,
      isRead: false,
      isDeleted: false,
    },
  });

  return { unreadCount: count };
};

// ─────────────────────────────────────────────────────────────
// DELETE MESSAGE (Soft delete)
// ─────────────────────────────────────────────────────────────

export const deleteMessage = async (
  userId: string,
  messageId: string,
  ipAddress?: string
) => {
  // Verify user owns the message (either sender or recipient)
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      OR: [{ senderUserId: userId }, { recipientUserId: userId }],
    },
  });

  if (!message) {
    throw new Error('Message not found or unauthorized');
  }

  const deleted = await prisma.message.update({
    where: { id: messageId },
    data: { isDeleted: true },
  });

  // Audit log
  await logAudit(
    userId,
    'MESSAGE_DELETE',
    { messageId },
    ipAddress
  );

  return deleted;
};

// ─────────────────────────────────────────────────────────────
// GET CONVERSATIONS LIST (All unique conversations)
// ─────────────────────────────────────────────────────────────

export const getConversationsList = async (userId: string) => {
  // Get all messages where user is sender or recipient
  const messages = await prisma.message.findMany({
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
  const conversations = await Promise.all(
    Array.from(conversationsMap.values()).map(async (conv) => {
      const user = await prisma.user.findUnique({
        where: { id: conv.userId },
        select: {
          id: true,
          email: true,
          role: true,
          studentProfile: { select: { fullName: true } },
          mentorProfile: { select: { bio: true } },
          adminProfile: { select: { id: true } },
        },
      });

      // Resolve display name for any role
      const userName =
        user?.studentProfile?.fullName ||
        (user?.mentorProfile ? (user.email.split('@')[0]) : null) ||
        (user?.adminProfile ? `Admin (${user.email.split('@')[0]})` : null) ||
        user?.email ||
        'Unknown';

      return {
        ...conv,
        userName,
        userRole: user?.role,
      };
    })
  );

  return conversations;
};
