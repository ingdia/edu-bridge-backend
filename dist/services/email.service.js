"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBulkEmails = exports.sendWelcomeEmail = exports.sendDeadlineAlert = exports.sendApplicationUpdate = exports.sendFeedbackNotification = exports.sendSessionReminder = exports.sendEmail = void 0;
// src/services/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// ─────────────────────────────────────────────────────────────
// EMAIL SERVICE (SRS FR 9: Notifications)
// ─────────────────────────────────────────────────────────────
// Create reusable transporter
const createTransporter = () => {
    // If no SMTP credentials, use console logging (development)
    if (!env_1.env.SMTP_USER || !env_1.env.SMTP_PASSWORD) {
        console.warn('[EMAIL] No SMTP credentials found. Emails will be logged to console.');
        return nodemailer_1.default.createTransport({
            streamTransport: true,
            newline: 'unix',
            buffer: true,
        });
    }
    return nodemailer_1.default.createTransport({
        host: env_1.env.SMTP_HOST,
        port: env_1.env.SMTP_PORT,
        secure: env_1.env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
            user: env_1.env.SMTP_USER,
            pass: env_1.env.SMTP_PASSWORD,
        },
    });
};
const transporter = createTransporter();
// ─────────────────────────────────────────────────────────────
// TEMPLATE RENDERING
// ─────────────────────────────────────────────────────────────
const loadTemplate = async (templateName) => {
    const templatePath = path.join(__dirname, '..', 'templates', 'email', `${templateName}.html`);
    return await fs.readFile(templatePath, 'utf-8');
};
const loadBaseTemplate = async () => {
    const basePath = path.join(__dirname, '..', 'templates', 'email', 'base.html');
    return await fs.readFile(basePath, 'utf-8');
};
const renderTemplate = (template, data) => {
    let rendered = template;
    // Simple template replacement (supports {{variable}})
    Object.keys(data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        rendered = rendered.replace(regex, data[key] || '');
    });
    // Handle conditionals {{#if variable}}...{{/if}}
    rendered = rendered.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, key, content) => {
        return data[key] ? content : '';
    });
    // Handle each loops {{#each array}}...{{/each}}
    rendered = rendered.replace(/{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g, (match, key, content) => {
        const array = data[key];
        if (!Array.isArray(array))
            return '';
        return array.map((item) => renderTemplate(content, item)).join('');
    });
    return rendered;
};
const wrapInBaseTemplate = async (content, subject) => {
    const baseTemplate = await loadBaseTemplate();
    return renderTemplate(baseTemplate, { content, subject });
};
const sendEmail = async (options) => {
    try {
        // Load and render template
        const templateContent = await loadTemplate(options.template);
        const renderedContent = renderTemplate(templateContent, options.data);
        const fullHtml = await wrapInBaseTemplate(renderedContent, options.subject);
        // Send email
        const info = await transporter.sendMail({
            from: `"${env_1.env.EMAIL_FROM_NAME}" <${env_1.env.EMAIL_FROM}>`,
            to: options.to,
            subject: options.subject,
            html: fullHtml,
        });
        console.log('[EMAIL_SENT]', {
            to: options.to,
            subject: options.subject,
            messageId: info.messageId,
        });
    }
    catch (error) {
        console.error('[EMAIL_ERROR]', {
            to: options.to,
            subject: options.subject,
            error: error instanceof Error ? error.message : String(error),
        });
        // Don't throw - email failures shouldn't break the main flow
    }
};
exports.sendEmail = sendEmail;
// ─────────────────────────────────────────────────────────────
// SPECIFIC EMAIL FUNCTIONS
// ─────────────────────────────────────────────────────────────
const sendSessionReminder = async (recipientEmail, recipientName, sessionData) => {
    await (0, exports.sendEmail)({
        to: recipientEmail,
        subject: '📅 Upcoming Mentorship Session Reminder',
        template: 'session-reminder',
        data: {
            recipientName,
            ...sessionData,
        },
    });
};
exports.sendSessionReminder = sendSessionReminder;
const sendFeedbackNotification = async (studentEmail, studentName, feedbackData) => {
    await (0, exports.sendEmail)({
        to: studentEmail,
        subject: '📝 Your Exercise Has Been Evaluated',
        template: 'feedback-received',
        data: {
            studentName,
            ...feedbackData,
        },
    });
};
exports.sendFeedbackNotification = sendFeedbackNotification;
const sendApplicationUpdate = async (studentEmail, studentName, applicationData) => {
    await (0, exports.sendEmail)({
        to: studentEmail,
        subject: '📬 Application Status Update',
        template: 'application-update',
        data: {
            studentName,
            ...applicationData,
        },
    });
};
exports.sendApplicationUpdate = sendApplicationUpdate;
const sendDeadlineAlert = async (studentEmail, studentName, deadlineData) => {
    await (0, exports.sendEmail)({
        to: studentEmail,
        subject: '⏰ Application Deadline Approaching',
        template: 'deadline-alert',
        data: {
            studentName,
            ...deadlineData,
        },
    });
};
exports.sendDeadlineAlert = sendDeadlineAlert;
const sendWelcomeEmail = async (userEmail, userName, userData) => {
    await (0, exports.sendEmail)({
        to: userEmail,
        subject: '🎉 Welcome to EDU-Bridge!',
        template: 'welcome',
        data: {
            userName,
            ...userData,
        },
    });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
// ─────────────────────────────────────────────────────────────
// BULK EMAIL SENDING
// ─────────────────────────────────────────────────────────────
const sendBulkEmails = async (recipients, subject, template) => {
    const promises = recipients.map((recipient) => (0, exports.sendEmail)({
        to: recipient.email,
        subject,
        template,
        data: { ...recipient.data, recipientName: recipient.name },
    }));
    await Promise.allSettled(promises);
};
exports.sendBulkEmails = sendBulkEmails;
//# sourceMappingURL=email.service.js.map