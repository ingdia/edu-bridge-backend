import { SendMessageInput, MarkAsReadInput } from '../validators/message.validator';
export declare const sendMessage: (senderUserId: string, senderRole: string, data: SendMessageInput, ipAddress?: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    readAt: Date | null;
    content: string;
    replyTo: string | null;
    subject: string | null;
    attachments: import("@prisma/client/runtime/library").JsonValue | null;
    recipientUserId: string;
    threadId: string | null;
    isRead: boolean;
    senderUserId: string;
    senderRole: import(".prisma/client").$Enums.Role;
    recipientRole: import(".prisma/client").$Enums.Role;
    isDeleted: boolean;
}>;
export declare const getMessages: (userId: string, filters: {
    conversationWith?: string;
    isRead?: boolean;
    limit?: number;
    page?: number;
}) => Promise<{
    messages: {
        id: string;
        createdAt: Date;
        readAt: Date | null;
        content: string;
        replyTo: string | null;
        subject: string | null;
        recipientUserId: string;
        threadId: string | null;
        isRead: boolean;
        senderUserId: string;
        senderRole: import(".prisma/client").$Enums.Role;
        recipientRole: import(".prisma/client").$Enums.Role;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getSentMessages: (userId: string, filters: {
    limit?: number;
    page?: number;
}) => Promise<{
    messages: {
        id: string;
        createdAt: Date;
        readAt: Date | null;
        content: string;
        subject: string | null;
        recipientUserId: string;
        threadId: string | null;
        isRead: boolean;
        recipientRole: import(".prisma/client").$Enums.Role;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const getConversation: (userId: string, otherUserId: string, filters: {
    limit?: number;
    page?: number;
}) => Promise<{
    messages: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        readAt: Date | null;
        content: string;
        replyTo: string | null;
        subject: string | null;
        attachments: import("@prisma/client/runtime/library").JsonValue | null;
        recipientUserId: string;
        threadId: string | null;
        isRead: boolean;
        senderUserId: string;
        senderRole: import(".prisma/client").$Enums.Role;
        recipientRole: import(".prisma/client").$Enums.Role;
        isDeleted: boolean;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}>;
export declare const markAsRead: (userId: string, data: MarkAsReadInput, ipAddress?: string) => Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare const getUnreadCount: (userId: string) => Promise<{
    unreadCount: number;
}>;
export declare const deleteMessage: (userId: string, messageId: string, ipAddress?: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    readAt: Date | null;
    content: string;
    replyTo: string | null;
    subject: string | null;
    attachments: import("@prisma/client/runtime/library").JsonValue | null;
    recipientUserId: string;
    threadId: string | null;
    isRead: boolean;
    senderUserId: string;
    senderRole: import(".prisma/client").$Enums.Role;
    recipientRole: import(".prisma/client").$Enums.Role;
    isDeleted: boolean;
}>;
export declare const getConversationsList: (userId: string) => Promise<any[]>;
//# sourceMappingURL=message.service.d.ts.map