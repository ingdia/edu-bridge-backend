// src/services/email.service.ts
import nodemailer from 'nodemailer';
import { env } from '../config/env';
import * as fs from 'fs/promises';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────
// EMAIL SERVICE (SRS FR 9: Notifications)
// ─────────────────────────────────────────────────────────────

// Create reusable transporter
const createTransporter = () => {
  // If no SMTP credentials, use console logging (development)
  if (!env.SMTP_USER || !env.SMTP_PASSWORD) {
    console.warn('[EMAIL] No SMTP credentials found. Emails will be logged to console.');
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
};

const transporter = createTransporter();

// ─────────────────────────────────────────────────────────────
// TEMPLATE RENDERING
// ─────────────────────────────────────────────────────────────

const loadTemplate = async (templateName: string): Promise<string> => {
  const templatePath = path.join(__dirname, '..', 'templates', 'email', `${templateName}.html`);
  return await fs.readFile(templatePath, 'utf-8');
};

const loadBaseTemplate = async (): Promise<string> => {
  const basePath = path.join(__dirname, '..', 'templates', 'email', 'base.html');
  return await fs.readFile(basePath, 'utf-8');
};

const renderTemplate = (template: string, data: Record<string, any>): string => {
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
    if (!Array.isArray(array)) return '';
    return array.map((item) => renderTemplate(content, item)).join('');
  });

  return rendered;
};

const wrapInBaseTemplate = async (content: string, subject: string): Promise<string> => {
  const baseTemplate = await loadBaseTemplate();
  return renderTemplate(baseTemplate, { content, subject });
};

// ─────────────────────────────────────────────────────────────
// SEND EMAIL FUNCTION
// ─────────────────────────────────────────────────────────────

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    // Load and render template
    const templateContent = await loadTemplate(options.template);
    const renderedContent = renderTemplate(templateContent, options.data);
    const fullHtml = await wrapInBaseTemplate(renderedContent, options.subject);

    // Send email
    const info = await transporter.sendMail({
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: fullHtml,
    });

    console.log('[EMAIL_SENT]', {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('[EMAIL_ERROR]', {
      to: options.to,
      subject: options.subject,
      error: error instanceof Error ? error.message : String(error),
    });
    // Don't throw - email failures shouldn't break the main flow
  }
};

// ─────────────────────────────────────────────────────────────
// SPECIFIC EMAIL FUNCTIONS
// ─────────────────────────────────────────────────────────────

export const sendSessionReminder = async (
  recipientEmail: string,
  recipientName: string,
  sessionData: {
    sessionDate: string;
    sessionTime: string;
    duration: number;
    location: string;
    mentorName?: string;
    studentName?: string;
    notes?: string;
    isMentor?: boolean;
  }
): Promise<void> => {
  await sendEmail({
    to: recipientEmail,
    subject: '📅 Upcoming Mentorship Session Reminder',
    template: 'session-reminder',
    data: {
      recipientName,
      ...sessionData,
    },
  });
};

export const sendFeedbackNotification = async (
  studentEmail: string,
  studentName: string,
  feedbackData: {
    moduleTitle: string;
    exerciseType: string;
    submittedDate: string;
    score?: number;
    isPassed?: boolean;
    feedback?: string;
    rubricScores?: Record<string, number>;
    submissionId: string;
    platformUrl: string;
  }
): Promise<void> => {
  await sendEmail({
    to: studentEmail,
    subject: '📝 Your Exercise Has Been Evaluated',
    template: 'feedback-received',
    data: {
      studentName,
      ...feedbackData,
    },
  });
};

export const sendApplicationUpdate = async (
  studentEmail: string,
  studentName: string,
  applicationData: {
    position: string;
    organization: string;
    type: string;
    status: string;
    deadline?: string;
    response?: string;
    nextSteps?: string;
    applicationId: string;
    platformUrl: string;
  }
): Promise<void> => {
  await sendEmail({
    to: studentEmail,
    subject: '📬 Application Status Update',
    template: 'application-update',
    data: {
      studentName,
      ...applicationData,
    },
  });
};

export const sendDeadlineAlert = async (
  studentEmail: string,
  studentName: string,
  deadlineData: {
    position: string;
    organization: string;
    deadline: string;
    daysRemaining: number;
    status: string;
    isNotSubmitted: boolean;
    applicationId: string;
    platformUrl: string;
  }
): Promise<void> => {
  await sendEmail({
    to: studentEmail,
    subject: '⏰ Application Deadline Approaching',
    template: 'deadline-alert',
    data: {
      studentName,
      ...deadlineData,
    },
  });
};

export const sendWelcomeEmail = async (
  userEmail: string,
  userName: string,
  userData: {
    email: string;
    role: string;
    schoolName: string;
    isStudent?: boolean;
    isMentor?: boolean;
    isAdmin?: boolean;
    platformUrl: string;
  }
): Promise<void> => {
  await sendEmail({
    to: userEmail,
    subject: '🎉 Welcome to EDU-Bridge!',
    template: 'welcome',
    data: {
      userName,
      ...userData,
    },
  });
};

// ─────────────────────────────────────────────────────────────
// BULK EMAIL SENDING
// ─────────────────────────────────────────────────────────────

export const sendBulkEmails = async (
  recipients: Array<{ email: string; name: string; data: Record<string, any> }>,
  subject: string,
  template: string
): Promise<void> => {
  const promises = recipients.map((recipient) =>
    sendEmail({
      to: recipient.email,
      subject,
      template,
      data: { ...recipient.data, recipientName: recipient.name },
    })
  );

  await Promise.allSettled(promises);
};
