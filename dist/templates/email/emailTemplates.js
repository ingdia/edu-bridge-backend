"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.emailTemplates = {
    sessionReminder: (data) => ({
        subject: 'Upcoming Mentorship Session Reminder',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EDU-Bridge Session Reminder</h1>
          </div>
          <div class="content">
            <p>Hello ${data.studentName},</p>
            <p>This is a reminder about your upcoming mentorship session:</p>
            <ul>
              <li><strong>Date & Time:</strong> ${data.sessionDate}</li>
              <li><strong>Location:</strong> ${data.location}</li>
              <li><strong>Mentor Contact:</strong> ${data.mentorEmail}</li>
            </ul>
            <p>Please arrive on time and bring any materials you need for the session.</p>
            <p>If you need to reschedule, please contact your mentor as soon as possible.</p>
          </div>
          <div class="footer">
            <p>EDU-Bridge Platform - Empowering Students Through Education</p>
            <p>GS Ruyenzi, Rwanda</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hello ${data.studentName},\n\nThis is a reminder about your upcoming mentorship session:\n\nDate & Time: ${data.sessionDate}\nLocation: ${data.location}\nMentor Contact: ${data.mentorEmail}\n\nPlease arrive on time and bring any materials you need for the session.\n\nEDU-Bridge Platform`
    }),
    deadlineAlert: (data) => ({
        subject: `Deadline Alert: ${data.title}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .alert { background-color: #fff3cd; border-left: 4px solid #FF9800; padding: 10px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Deadline Alert</h1>
          </div>
          <div class="content">
            <p>Hello ${data.studentName},</p>
            <div class="alert">
              <p><strong>${data.type} Deadline Approaching!</strong></p>
              <p><strong>Title:</strong> ${data.title}</p>
              <p><strong>Deadline:</strong> ${data.deadline}</p>
            </div>
            <p>Don't miss this opportunity! Make sure to complete your application before the deadline.</p>
          </div>
          <div class="footer">
            <p>EDU-Bridge Platform - Empowering Students Through Education</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hello ${data.studentName},\n\nDeadline Alert!\n\nType: ${data.type}\nTitle: ${data.title}\nDeadline: ${data.deadline}\n\nDon't miss this opportunity!\n\nEDU-Bridge Platform`
    }),
    feedbackReceived: (data) => ({
        subject: 'New Feedback on Your Exercise',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .score { font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0; }
          .feedback-box { background-color: white; padding: 15px; border-left: 4px solid #2196F3; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 New Feedback Available</h1>
          </div>
          <div class="content">
            <p>Hello ${data.studentName},</p>
            <p>Your mentor has reviewed your exercise: <strong>${data.exerciseTitle}</strong></p>
            <div class="score">Score: ${data.score}/100</div>
            <div class="feedback-box">
              <h3>Mentor Feedback:</h3>
              <p>${data.feedback}</p>
            </div>
            <p>Keep up the great work! Continue practicing to improve your skills.</p>
          </div>
          <div class="footer">
            <p>EDU-Bridge Platform - Empowering Students Through Education</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hello ${data.studentName},\n\nYour mentor has reviewed your exercise: ${data.exerciseTitle}\n\nScore: ${data.score}/100\n\nFeedback:\n${data.feedback}\n\nKeep up the great work!\n\nEDU-Bridge Platform`
    }),
    applicationUpdate: (data) => ({
        subject: `Application Update: ${data.position}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .status { background-color: #e1bee7; padding: 15px; border-radius: 5px; margin: 10px 0; text-align: center; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Application Status Update</h1>
          </div>
          <div class="content">
            <p>Hello ${data.studentName},</p>
            <p>There's an update on your application:</p>
            <div class="status">
              <p><strong>Position:</strong> ${data.position}</p>
              <p><strong>Organization:</strong> ${data.organization}</p>
              <p><strong>Status:</strong> ${data.status}</p>
            </div>
            <p>Log in to your EDU-Bridge account to view more details.</p>
          </div>
          <div class="footer">
            <p>EDU-Bridge Platform - Empowering Students Through Education</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hello ${data.studentName},\n\nApplication Update:\n\nPosition: ${data.position}\nOrganization: ${data.organization}\nStatus: ${data.status}\n\nLog in to view more details.\n\nEDU-Bridge Platform`
    }),
    systemAnnouncement: (data) => ({
        subject: `EDU-Bridge Announcement: ${data.title}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #607D8B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .announcement { background-color: white; padding: 20px; border-left: 4px solid #607D8B; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 System Announcement</h1>
          </div>
          <div class="content">
            <div class="announcement">
              <h2>${data.title}</h2>
              <p>${data.message}</p>
            </div>
          </div>
          <div class="footer">
            <p>EDU-Bridge Platform - Empowering Students Through Education</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `EDU-Bridge Announcement\n\n${data.title}\n\n${data.message}\n\nEDU-Bridge Platform`
    }),
    welcomeStudent: (data) => ({
        subject: 'Welcome to EDU-Bridge Platform!',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .credentials { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .warning { color: #d32f2f; font-weight: bold; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome to EDU-Bridge!</h1>
          </div>
          <div class="content">
            <p>Hello ${data.studentName},</p>
            <p>Welcome to EDU-Bridge Platform! Your account has been created successfully.</p>
            <div class="credentials">
              <h3>Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Temporary Password:</strong> ${data.temporaryPassword}</p>
              <p class="warning">⚠️ Please change your password after your first login.</p>
            </div>
            <p>EDU-Bridge will help you:</p>
            <ul>
              <li>Improve your English communication skills</li>
              <li>Build digital literacy</li>
              <li>Receive mentorship and career guidance</li>
              <li>Track your academic progress</li>
              <li>Find opportunities for jobs and university</li>
            </ul>
            <p>Log in now and start your learning journey!</p>
          </div>
          <div class="footer">
            <p>EDU-Bridge Platform - Empowering Students Through Education</p>
            <p>GS Ruyenzi, Rwanda</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Welcome to EDU-Bridge Platform!\n\nHello ${data.studentName},\n\nYour account has been created successfully.\n\nLogin Credentials:\nEmail: ${data.email}\nTemporary Password: ${data.temporaryPassword}\n\n⚠️ Please change your password after your first login.\n\nEDU-Bridge Platform`
    })
};
//# sourceMappingURL=emailTemplates.js.map