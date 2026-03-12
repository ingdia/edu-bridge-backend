"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSimulationService = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.emailSimulationService = {
    async getInbox(studentId) {
        const progress = await database_1.default.digitalLiteracyProgress.findMany({
            where: {
                studentId,
                lessonType: 'email'
            },
            orderBy: { createdAt: 'desc' }
        });
        const emails = [];
        for (const p of progress) {
            if (p.practiceData && typeof p.practiceData === 'object') {
                const data = p.practiceData;
                if (data.inbox && Array.isArray(data.inbox)) {
                    emails.push(...data.inbox);
                }
            }
        }
        return emails;
    },
    async sendEmail(studentId, draft) {
        const emailId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sentEmail = {
            id: emailId,
            from: 'student@edubridge.rw',
            to: draft.to,
            subject: draft.subject,
            body: draft.body,
            sentAt: new Date(),
            isRead: false
        };
        const validation = this.validateEmail(draft);
        let progress = await database_1.default.digitalLiteracyProgress.findFirst({
            where: {
                studentId,
                lessonType: 'email',
                lessonTitle: 'Email Practice'
            }
        });
        if (!progress) {
            progress = await database_1.default.digitalLiteracyProgress.create({
                data: {
                    studentId,
                    lessonType: 'email',
                    lessonTitle: 'Email Practice',
                    practiceData: JSON.parse(JSON.stringify({
                        sent: [sentEmail],
                        inbox: [],
                        drafts: []
                    }))
                }
            });
        }
        else {
            const currentData = progress.practiceData || { sent: [], inbox: [], drafts: [] };
            await database_1.default.digitalLiteracyProgress.update({
                where: { id: progress.id },
                data: {
                    practiceData: JSON.parse(JSON.stringify({
                        ...currentData,
                        sent: [...(currentData.sent || []), sentEmail]
                    }))
                }
            });
        }
        if (validation.isValid) {
            await this.simulateReply(studentId, sentEmail);
        }
        return { email: sentEmail, validation };
    },
    async simulateReply(studentId, originalEmail) {
        setTimeout(async () => {
            const replyEmail = {
                id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                from: originalEmail.to,
                to: originalEmail.from,
                subject: `Re: ${originalEmail.subject}`,
                body: `Thank you for your email. This is an automated response for practice purposes.`,
                sentAt: new Date(),
                isRead: false
            };
            const progress = await database_1.default.digitalLiteracyProgress.findFirst({
                where: {
                    studentId,
                    lessonType: 'email',
                    lessonTitle: 'Email Practice'
                }
            });
            if (progress) {
                const currentData = progress.practiceData || { sent: [], inbox: [], drafts: [] };
                await database_1.default.digitalLiteracyProgress.update({
                    where: { id: progress.id },
                    data: {
                        practiceData: JSON.parse(JSON.stringify({
                            ...currentData,
                            inbox: [...(currentData.inbox || []), replyEmail]
                        }))
                    }
                });
            }
        }, 5000);
    },
    validateEmail(draft) {
        const errors = [];
        let score = 0;
        if (!draft.to || !draft.to.includes('@')) {
            errors.push('Invalid recipient email address');
        }
        else {
            score += 20;
        }
        if (!draft.subject || draft.subject.trim().length === 0) {
            errors.push('Subject line is required');
        }
        else if (draft.subject.length < 5) {
            errors.push('Subject line is too short');
        }
        else {
            score += 20;
        }
        if (!draft.body || draft.body.trim().length === 0) {
            errors.push('Email body is required');
        }
        else if (draft.body.length < 20) {
            errors.push('Email body is too short');
        }
        else {
            score += 30;
        }
        if (draft.body && /^(Dear|Hello|Hi)/i.test(draft.body)) {
            score += 15;
        }
        if (draft.body && /(Sincerely|Best regards|Thank you|Regards)/i.test(draft.body)) {
            score += 15;
        }
        return {
            isValid: errors.length === 0,
            score,
            errors,
            feedback: this.generateFeedback(score, errors)
        };
    },
    generateFeedback(score, errors) {
        if (score >= 90) {
            return 'Excellent! Your email is professional and well-structured.';
        }
        else if (score >= 70) {
            return 'Good job! Minor improvements needed: ' + errors.join(', ');
        }
        else if (score >= 50) {
            return 'Fair attempt. Please address: ' + errors.join(', ');
        }
        else {
            return 'Needs improvement. Issues: ' + errors.join(', ');
        }
    },
    async markAsRead(studentId, emailId) {
        const progress = await database_1.default.digitalLiteracyProgress.findFirst({
            where: {
                studentId,
                lessonType: 'email',
                lessonTitle: 'Email Practice'
            }
        });
        if (progress) {
            const currentData = progress.practiceData || { sent: [], inbox: [], drafts: [] };
            const inbox = currentData.inbox || [];
            const updatedInbox = inbox.map((email) => email.id === emailId ? { ...email, isRead: true } : email);
            await database_1.default.digitalLiteracyProgress.update({
                where: { id: progress.id },
                data: {
                    practiceData: JSON.parse(JSON.stringify({
                        ...currentData,
                        inbox: updatedInbox
                    }))
                }
            });
        }
    },
    async getSentEmails(studentId) {
        const progress = await database_1.default.digitalLiteracyProgress.findFirst({
            where: {
                studentId,
                lessonType: 'email',
                lessonTitle: 'Email Practice'
            }
        });
        if (progress && progress.practiceData) {
            const data = progress.practiceData;
            return data.sent || [];
        }
        return [];
    }
};
//# sourceMappingURL=emailSimulation.service.js.map