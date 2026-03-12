export declare const emailTemplates: {
    sessionReminder: (data: {
        studentName: string;
        sessionDate: string;
        location: string;
        mentorEmail: string;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
    deadlineAlert: (data: {
        studentName: string;
        title: string;
        deadline: string;
        type: string;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
    feedbackReceived: (data: {
        studentName: string;
        exerciseTitle: string;
        score: number;
        feedback: string;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
    applicationUpdate: (data: {
        studentName: string;
        position: string;
        organization: string;
        status: string;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
    systemAnnouncement: (data: {
        title: string;
        message: string;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
    welcomeStudent: (data: {
        studentName: string;
        email: string;
        temporaryPassword: string;
    }) => {
        subject: string;
        html: string;
        text: string;
    };
};
//# sourceMappingURL=emailTemplates.d.ts.map