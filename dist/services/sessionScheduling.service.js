"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingSessions = exports.getStudentSessions = exports.getMentorSessions = exports.completeSession = exports.cancelSession = exports.rescheduleSession = exports.createWeeklyLabSession = exports.createMentorshipSession = void 0;
// src/services/sessionScheduling.service.ts
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const notification_service_1 = require("./notification.service");
// ─────────────────────────────────────────────────────────────
// CREATE MENTORSHIP SESSION
// ─────────────────────────────────────────────────────────────
const createMentorshipSession = async (mentorId, studentId, scheduledFor, duration = 60, location, notes) => {
    // Verify student exists
    const student = await database_1.default.studentProfile.findUnique({
        where: { id: studentId },
        include: { user: { select: { email: true } } }
    });
    if (!student) {
        throw new Error('Student not found');
    }
    // Check for scheduling conflicts
    const conflict = await database_1.default.mentorshipSession.findFirst({
        where: {
            mentorId,
            scheduledFor: {
                gte: new Date(scheduledFor.getTime() - duration * 60 * 1000),
                lte: new Date(scheduledFor.getTime() + duration * 60 * 1000)
            },
            status: { in: ['SCHEDULED', 'COMPLETED'] }
        }
    });
    if (conflict) {
        throw new Error('Mentor already has a session scheduled at this time');
    }
    // Create session
    const session = await database_1.default.mentorshipSession.create({
        data: {
            mentorId,
            studentId,
            scheduledFor,
            duration,
            location: location || 'Computer Lab',
            notes,
            status: 'SCHEDULED'
        },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    user: { select: { email: true } }
                }
            },
            mentor: {
                select: {
                    id: true,
                    user: { select: { email: true } }
                }
            }
        }
    });
    // Send notification to student
    await notification_service_1.notificationService.createSessionReminder(studentId, {
        id: session.id,
        scheduledFor: session.scheduledFor,
        location: session.location,
        duration: session.duration
    }, mentorId);
    await (0, logger_1.logAudit)(mentorId, 'SESSION_CREATE', {
        sessionId: session.id,
        studentId,
        scheduledFor
    });
    return session;
};
exports.createMentorshipSession = createMentorshipSession;
// ─────────────────────────────────────────────────────────────
// CREATE WEEKLY LAB SESSION (BULK)
// ─────────────────────────────────────────────────────────────
const createWeeklyLabSession = async (mentorId, studentIds, scheduledFor, duration = 120, location = 'Computer Lab', notes) => {
    const sessions = [];
    for (const studentId of studentIds) {
        try {
            const session = await (0, exports.createMentorshipSession)(mentorId, studentId, scheduledFor, duration, location, notes);
            sessions.push(session);
        }
        catch (error) {
            console.error(`[SESSION_CREATE_ERROR] Student ${studentId}:`, error);
        }
    }
    await (0, logger_1.logAudit)(mentorId, 'SESSION_CREATE', {
        type: 'weekly_lab',
        count: sessions.length,
        scheduledFor
    });
    return sessions;
};
exports.createWeeklyLabSession = createWeeklyLabSession;
// ─────────────────────────────────────────────────────────────
// RESCHEDULE SESSION
// ─────────────────────────────────────────────────────────────
const rescheduleSession = async (sessionId, mentorId, newScheduledFor, reason) => {
    const session = await database_1.default.mentorshipSession.findUnique({
        where: { id: sessionId },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    user: { select: { email: true } }
                }
            }
        }
    });
    if (!session) {
        throw new Error('Session not found');
    }
    if (session.mentorId !== mentorId) {
        throw new Error('Unauthorized: Not your session');
    }
    if (session.status !== 'SCHEDULED') {
        throw new Error('Can only reschedule scheduled sessions');
    }
    // Check for conflicts at new time
    const conflict = await database_1.default.mentorshipSession.findFirst({
        where: {
            mentorId,
            id: { not: sessionId },
            scheduledFor: {
                gte: new Date(newScheduledFor.getTime() - session.duration * 60 * 1000),
                lte: new Date(newScheduledFor.getTime() + session.duration * 60 * 1000)
            },
            status: { in: ['SCHEDULED', 'COMPLETED'] }
        }
    });
    if (conflict) {
        throw new Error('Mentor already has a session scheduled at this time');
    }
    // Update session
    const updated = await database_1.default.mentorshipSession.update({
        where: { id: sessionId },
        data: {
            scheduledFor: newScheduledFor,
            notes: reason ? `${session.notes || ''}\nRescheduled: ${reason}` : session.notes
        },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    user: { select: { email: true } }
                }
            }
        }
    });
    // Notify student
    await notification_service_1.notificationService.createNotification({
        recipientId: session.studentId,
        type: 'SESSION_REMINDER',
        title: 'Session Rescheduled',
        message: `Your mentorship session has been rescheduled to ${newScheduledFor.toLocaleString()}${reason ? `. Reason: ${reason}` : ''}`,
        actionUrl: `/mentorship/sessions/${sessionId}`,
        sentByMentorId: mentorId,
        sendEmail: true
    });
    await (0, logger_1.logAudit)(mentorId, 'SESSION_RESCHEDULE', {
        sessionId,
        oldTime: session.scheduledFor,
        newTime: newScheduledFor,
        reason
    });
    return updated;
};
exports.rescheduleSession = rescheduleSession;
// ─────────────────────────────────────────────────────────────
// CANCEL SESSION
// ─────────────────────────────────────────────────────────────
const cancelSession = async (sessionId, mentorId, reason) => {
    const session = await database_1.default.mentorshipSession.findUnique({
        where: { id: sessionId },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    user: { select: { email: true } }
                }
            }
        }
    });
    if (!session) {
        throw new Error('Session not found');
    }
    if (session.mentorId !== mentorId) {
        throw new Error('Unauthorized: Not your session');
    }
    if (session.status !== 'SCHEDULED') {
        throw new Error('Can only cancel scheduled sessions');
    }
    // Update session status
    const updated = await database_1.default.mentorshipSession.update({
        where: { id: sessionId },
        data: {
            status: 'CANCELLED',
            notes: reason ? `${session.notes || ''}\nCancelled: ${reason}` : session.notes
        }
    });
    // Notify student
    await notification_service_1.notificationService.createNotification({
        recipientId: session.studentId,
        type: 'SESSION_REMINDER',
        title: 'Session Cancelled',
        message: `Your mentorship session scheduled for ${session.scheduledFor.toLocaleString()} has been cancelled${reason ? `. Reason: ${reason}` : ''}`,
        sentByMentorId: mentorId,
        sendEmail: true
    });
    await (0, logger_1.logAudit)(mentorId, 'SESSION_CANCEL', {
        sessionId,
        scheduledFor: session.scheduledFor,
        reason
    });
    return updated;
};
exports.cancelSession = cancelSession;
// ─────────────────────────────────────────────────────────────
// COMPLETE SESSION
// ─────────────────────────────────────────────────────────────
const completeSession = async (sessionId, mentorId, notes, actionItems) => {
    const session = await database_1.default.mentorshipSession.findUnique({
        where: { id: sessionId }
    });
    if (!session) {
        throw new Error('Session not found');
    }
    if (session.mentorId !== mentorId) {
        throw new Error('Unauthorized: Not your session');
    }
    if (session.status !== 'SCHEDULED') {
        throw new Error('Can only complete scheduled sessions');
    }
    // Update session
    const updated = await database_1.default.mentorshipSession.update({
        where: { id: sessionId },
        data: {
            status: 'COMPLETED',
            notes: notes || session.notes,
            actionItems
        },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    user: { select: { email: true } }
                }
            }
        }
    });
    await (0, logger_1.logAudit)(mentorId, 'SESSION_UPDATE', {
        sessionId,
        status: 'COMPLETED'
    });
    return updated;
};
exports.completeSession = completeSession;
// ─────────────────────────────────────────────────────────────
// GET MENTOR'S SESSIONS
// ─────────────────────────────────────────────────────────────
const getMentorSessions = async (mentorId, filters) => {
    const where = { mentorId };
    if (filters?.status) {
        where.status = filters.status;
    }
    if (filters?.startDate || filters?.endDate) {
        where.scheduledFor = {};
        if (filters.startDate)
            where.scheduledFor.gte = filters.startDate;
        if (filters.endDate)
            where.scheduledFor.lte = filters.endDate;
    }
    if (filters?.studentId) {
        where.studentId = filters.studentId;
    }
    const sessions = await database_1.default.mentorshipSession.findMany({
        where,
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    gradeLevel: true,
                    user: { select: { email: true } }
                }
            }
        },
        orderBy: { scheduledFor: 'desc' }
    });
    return sessions;
};
exports.getMentorSessions = getMentorSessions;
// ─────────────────────────────────────────────────────────────
// GET STUDENT'S SESSIONS
// ─────────────────────────────────────────────────────────────
const getStudentSessions = async (studentId, filters) => {
    const where = { studentId };
    if (filters?.status) {
        where.status = filters.status;
    }
    if (filters?.startDate || filters?.endDate) {
        where.scheduledFor = {};
        if (filters.startDate)
            where.scheduledFor.gte = filters.startDate;
        if (filters.endDate)
            where.scheduledFor.lte = filters.endDate;
    }
    const sessions = await database_1.default.mentorshipSession.findMany({
        where,
        include: {
            mentor: {
                select: {
                    id: true,
                    user: { select: { email: true } },
                    expertise: true
                }
            }
        },
        orderBy: { scheduledFor: 'desc' }
    });
    return sessions;
};
exports.getStudentSessions = getStudentSessions;
// ─────────────────────────────────────────────────────────────
// GET UPCOMING SESSIONS (NEXT 7 DAYS)
// ─────────────────────────────────────────────────────────────
const getUpcomingSessions = async (mentorId) => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return await database_1.default.mentorshipSession.findMany({
        where: {
            mentorId,
            scheduledFor: {
                gte: now,
                lte: nextWeek
            },
            status: 'SCHEDULED'
        },
        include: {
            student: {
                select: {
                    id: true,
                    fullName: true,
                    gradeLevel: true,
                    user: { select: { email: true } }
                }
            }
        },
        orderBy: { scheduledFor: 'asc' }
    });
};
exports.getUpcomingSessions = getUpcomingSessions;
//# sourceMappingURL=sessionScheduling.service.js.map