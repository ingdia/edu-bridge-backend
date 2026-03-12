import { NotificationType, NotificationStatus } from '@prisma/client';
interface CreateNotificationData {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
    sentByMentorId?: string;
    sentByAdminId?: string;
    sendEmail?: boolean;
}
export declare class NotificationService {
    createNotification(data: CreateNotificationData): Promise<{
        recipient: {
            id: string;
            user: {
                email: string;
            };
            fullName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    }>;
    createBulkNotifications(recipientIds: string[], data: Omit<CreateNotificationData, 'recipientId'>): Promise<({
        recipient: {
            id: string;
            user: {
                email: string;
            };
            fullName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    })[]>;
    getStudentNotifications(studentId: string, filters?: {
        type?: NotificationType;
        status?: NotificationStatus;
        limit?: number;
    }): Promise<({
        sentByMentor: {
            id: string;
            user: {
                email: string;
            };
        } | null;
        sentByAdmin: {
            id: string;
            user: {
                email: string;
            };
        } | null;
    } & {
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    })[]>;
    markAsRead(notificationId: string, studentId: string): Promise<{
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    }>;
    markAllAsRead(studentId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateNotificationStatus(notificationId: string, studentId: string, status: NotificationStatus): Promise<{
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    }>;
    deleteNotification(notificationId: string, studentId: string): Promise<{
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    }>;
    getUnreadCount(studentId: string): Promise<number>;
    private sendEmailNotification;
    createSessionReminder(studentId: string, sessionDetails: any, mentorId?: string): Promise<{
        recipient: {
            id: string;
            user: {
                email: string;
            };
            fullName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    }>;
    createDeadlineAlert(studentId: string, deadlineDetails: any, adminId?: string): Promise<{
        recipient: {
            id: string;
            user: {
                email: string;
            };
            fullName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    }>;
    createFeedbackNotification(studentId: string, feedbackDetails: any, mentorId?: string): Promise<{
        recipient: {
            id: string;
            user: {
                email: string;
            };
            fullName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.NotificationStatus;
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        recipientId: string;
        title: string;
        actionUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        sentByMentorId: string | null;
        sentByAdminId: string | null;
        emailSent: boolean;
        emailSentAt: Date | null;
        readAt: Date | null;
    }>;
}
export declare const notificationService: NotificationService;
export {};
//# sourceMappingURL=notification.service.d.ts.map