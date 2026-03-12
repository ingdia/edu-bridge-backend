export interface SendEmailOptions {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}
export declare const sendEmail: (options: SendEmailOptions) => Promise<void>;
export declare const sendSessionReminder: (recipientEmail: string, recipientName: string, sessionData: {
    sessionDate: string;
    sessionTime: string;
    duration: number;
    location: string;
    mentorName?: string;
    studentName?: string;
    notes?: string;
    isMentor?: boolean;
}) => Promise<void>;
export declare const sendFeedbackNotification: (studentEmail: string, studentName: string, feedbackData: {
    moduleTitle: string;
    exerciseType: string;
    submittedDate: string;
    score?: number;
    isPassed?: boolean;
    feedback?: string;
    rubricScores?: Record<string, number>;
    submissionId: string;
    platformUrl: string;
}) => Promise<void>;
export declare const sendApplicationUpdate: (studentEmail: string, studentName: string, applicationData: {
    position: string;
    organization: string;
    type: string;
    status: string;
    deadline?: string;
    response?: string;
    nextSteps?: string;
    applicationId: string;
    platformUrl: string;
}) => Promise<void>;
export declare const sendDeadlineAlert: (studentEmail: string, studentName: string, deadlineData: {
    position: string;
    organization: string;
    deadline: string;
    daysRemaining: number;
    status: string;
    isNotSubmitted: boolean;
    applicationId: string;
    platformUrl: string;
}) => Promise<void>;
export declare const sendWelcomeEmail: (userEmail: string, userName: string, userData: {
    email: string;
    role: string;
    schoolName: string;
    isStudent?: boolean;
    isMentor?: boolean;
    isAdmin?: boolean;
    platformUrl: string;
}) => Promise<void>;
export declare const sendBulkEmails: (recipients: Array<{
    email: string;
    name: string;
    data: Record<string, any>;
}>, subject: string, template: string) => Promise<void>;
//# sourceMappingURL=email.service.d.ts.map