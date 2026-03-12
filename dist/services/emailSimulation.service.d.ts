interface SimulatedEmail {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    sentAt: Date;
    isRead: boolean;
    hasAttachment?: boolean;
}
interface EmailDraft {
    to: string;
    subject: string;
    body: string;
    cc?: string;
    bcc?: string;
}
export declare const emailSimulationService: {
    getInbox(studentId: string): Promise<SimulatedEmail[]>;
    sendEmail(studentId: string, draft: EmailDraft): Promise<{
        email: SimulatedEmail;
        validation: {
            isValid: boolean;
            score: number;
            errors: string[];
            feedback: string;
        };
    }>;
    simulateReply(studentId: string, originalEmail: SimulatedEmail): Promise<void>;
    validateEmail(draft: EmailDraft): {
        isValid: boolean;
        score: number;
        errors: string[];
        feedback: string;
    };
    generateFeedback(score: number, errors: string[]): string;
    markAsRead(studentId: string, emailId: string): Promise<void>;
    getSentEmails(studentId: string): Promise<any>;
};
export {};
//# sourceMappingURL=emailSimulation.service.d.ts.map