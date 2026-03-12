export declare const scheduleSessionReminders: () => Promise<({
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
export declare const scheduleDeadlineAlerts: () => Promise<({
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
export declare const sendFeedbackNotifications: (studentId: string, submissionId: string, mentorId: string) => Promise<{
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
export declare const sendApplicationUpdateNotification: (studentId: string, applicationId: string, updateType: "SUBMITTED" | "ACCEPTED" | "REJECTED" | "INTERVIEW", adminId?: string) => Promise<{
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
export declare const sendSystemAnnouncement: (title: string, message: string, targetStudents: string[], adminId: string, actionUrl?: string) => Promise<({
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
export declare const runScheduledNotifications: () => Promise<{
    sessionReminders: number;
    deadlineAlerts: number;
}>;
//# sourceMappingURL=notificationScheduler.service.d.ts.map