"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorshipService = void 0;
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
const notification_service_1 = require("./notification.service");
class MentorshipService {
    static async createSession(data, mentorUserId) {
        const mentorProfile = await database_1.default.mentorProfile.findUnique({
            where: { userId: mentorUserId },
        });
        if (!mentorProfile) {
            throw new Error('Mentor profile not found');
        }
        // Check if student exists
        const student = await database_1.default.studentProfile.findUnique({
            where: { id: data.studentId },
        });
        if (!student) {
            throw new Error('Student not found');
        }
        // Check for scheduling conflicts
        const conflict = await this.checkSchedulingConflict(mentorProfile.id, data.scheduledFor, data.duration || 60);
        if (conflict) {
            throw new Error('Scheduling conflict: You already have a session at this time');
        }
        const session = await database_1.default.mentorshipSession.create({
            data: {
                ...data,
                mentorId: mentorProfile.id,
            },
            include: {
                student: { select: { fullName: true, user: { select: { email: true } } } },
            },
        });
        // Send notification to student
        await notification_service_1.notificationService.createSessionReminder(data.studentId, {
            id: session.id,
            scheduledFor: session.scheduledFor,
            duration: session.duration,
            location: session.location,
        }, mentorProfile.id);
        await (0, logger_1.logAudit)(mentorUserId, 'SESSION_CREATE', { sessionId: session.id });
        return { data: session, message: 'Session scheduled successfully' };
    }
    static async updateSession(sessionId, data, mentorUserId) {
        const session = await database_1.default.mentorshipSession.update({
            where: { id: sessionId },
            data,
            include: {
                student: { select: { fullName: true } },
            },
        });
        await (0, logger_1.logAudit)(mentorUserId, 'SESSION_UPDATE', { sessionId, status: data.status });
        return { data: session, message: 'Session updated successfully' };
    }
    static async rescheduleSession(sessionId, data, mentorUserId) {
        const mentorProfile = await database_1.default.mentorProfile.findUnique({
            where: { userId: mentorUserId },
        });
        if (!mentorProfile) {
            throw new Error('Mentor profile not found');
        }
        // Get existing session
        const existingSession = await database_1.default.mentorshipSession.findUnique({
            where: { id: sessionId },
            include: { student: true },
        });
        if (!existingSession) {
            throw new Error('Session not found');
        }
        if (existingSession.mentorId !== mentorProfile.id) {
            throw new Error('Unauthorized: You can only reschedule your own sessions');
        }
        if (existingSession.status !== 'SCHEDULED') {
            throw new Error('Can only reschedule sessions with SCHEDULED status');
        }
        // Check for conflicts with new time
        const conflict = await this.checkSchedulingConflict(mentorProfile.id, data.scheduledFor, data.duration || existingSession.duration, sessionId // Exclude current session from conflict check
        );
        if (conflict) {
            throw new Error('Scheduling conflict: You already have a session at this time');
        }
        const updatedSession = await database_1.default.mentorshipSession.update({
            where: { id: sessionId },
            data: {
                scheduledFor: data.scheduledFor,
                duration: data.duration,
                location: data.location,
                notes: data.notes,
            },
            include: {
                student: { select: { fullName: true, user: { select: { email: true } } } },
            },
        });
        // Notify student about reschedule
        await notification_service_1.notificationService.createNotification({
            recipientId: existingSession.studentId,
            type: 'SESSION_REMINDER',
            title: 'Session Rescheduled',
            message: `Your mentorship session has been rescheduled to ${new Date(data.scheduledFor).toLocaleString()}`,
            actionUrl: `/mentorship/sessions/${sessionId}`,
            sentByMentorId: mentorProfile.id,
            sendEmail: true,
        });
        await (0, logger_1.logAudit)(mentorUserId, 'SESSION_RESCHEDULE', {
            sessionId,
            oldTime: existingSession.scheduledFor,
            newTime: data.scheduledFor,
        });
        return { data: updatedSession, message: 'Session rescheduled successfully' };
    }
    static async cancelSession(sessionId, data, userId, userRole) {
        const session = await database_1.default.mentorshipSession.findUnique({
            where: { id: sessionId },
            include: {
                student: true,
                mentor: true,
            },
        });
        if (!session) {
            throw new Error('Session not found');
        }
        // Verify authorization
        if (userRole === 'MENTOR') {
            const mentorProfile = await database_1.default.mentorProfile.findUnique({
                where: { userId },
            });
            if (!mentorProfile || session.mentorId !== mentorProfile.id) {
                throw new Error('Unauthorized: You can only cancel your own sessions');
            }
        }
        else if (userRole === 'STUDENT') {
            const studentProfile = await database_1.default.studentProfile.findUnique({
                where: { userId },
            });
            if (!studentProfile || session.studentId !== studentProfile.id) {
                throw new Error('Unauthorized: You can only cancel your own sessions');
            }
        }
        if (session.status !== 'SCHEDULED') {
            throw new Error('Can only cancel sessions with SCHEDULED status');
        }
        const cancelledSession = await database_1.default.mentorshipSession.update({
            where: { id: sessionId },
            data: {
                status: 'CANCELLED',
                notes: `${session.notes || ''}\n\nCancellation reason: ${data.reason}`,
            },
            include: {
                student: { select: { fullName: true } },
                mentor: { select: { user: { select: { email: true } } } },
            },
        });
        // Notify the other party
        if (userRole === 'MENTOR') {
            await notification_service_1.notificationService.createNotification({
                recipientId: session.studentId,
                type: 'SESSION_REMINDER',
                title: 'Session Cancelled',
                message: `Your mentorship session scheduled for ${new Date(session.scheduledFor).toLocaleString()} has been cancelled. Reason: ${data.reason}`,
                sentByMentorId: session.mentorId,
                sendEmail: true,
            });
        }
        await (0, logger_1.logAudit)(userId, 'SESSION_CANCEL', { sessionId, reason: data.reason });
        return { data: cancelledSession, message: 'Session cancelled successfully' };
    }
    static async getMentorSessions(mentorUserId, filters) {
        const mentorProfile = await database_1.default.mentorProfile.findUnique({
            where: { userId: mentorUserId },
        });
        if (!mentorProfile) {
            throw new Error('Mentor profile not found');
        }
        const where = { mentorId: mentorProfile.id };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.studentId) {
            where.studentId = filters.studentId;
        }
        if (filters?.startDate || filters?.endDate) {
            where.scheduledFor = {};
            if (filters.startDate) {
                where.scheduledFor.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.scheduledFor.lte = filters.endDate;
            }
        }
        const sessions = await database_1.default.mentorshipSession.findMany({
            where,
            include: {
                student: { select: { fullName: true, gradeLevel: true } },
            },
            orderBy: { scheduledFor: 'desc' },
        });
        return { data: sessions, message: 'Sessions retrieved successfully' };
    }
    static async getStudentSessions(studentUserId, filters) {
        const studentProfile = await database_1.default.studentProfile.findUnique({
            where: { userId: studentUserId },
        });
        if (!studentProfile) {
            throw new Error('Student profile not found');
        }
        const where = { studentId: studentProfile.id };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.startDate || filters?.endDate) {
            where.scheduledFor = {};
            if (filters.startDate) {
                where.scheduledFor.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.scheduledFor.lte = filters.endDate;
            }
        }
        const sessions = await database_1.default.mentorshipSession.findMany({
            where,
            include: {
                mentor: {
                    select: {
                        user: { select: { email: true } },
                        expertise: true,
                    },
                },
            },
            orderBy: { scheduledFor: 'desc' },
        });
        return { data: sessions, message: 'Sessions retrieved successfully' };
    }
    static async getUpcomingSessions(userId, userRole) {
        const now = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        let where = {
            status: 'SCHEDULED',
            scheduledFor: {
                gte: now,
                lte: oneWeekFromNow,
            },
        };
        if (userRole === 'MENTOR') {
            const mentorProfile = await database_1.default.mentorProfile.findUnique({
                where: { userId },
            });
            if (!mentorProfile)
                throw new Error('Mentor profile not found');
            where.mentorId = mentorProfile.id;
        }
        else if (userRole === 'STUDENT') {
            const studentProfile = await database_1.default.studentProfile.findUnique({
                where: { userId },
            });
            if (!studentProfile)
                throw new Error('Student profile not found');
            where.studentId = studentProfile.id;
        }
        const sessions = await database_1.default.mentorshipSession.findMany({
            where,
            include: {
                student: { select: { fullName: true, gradeLevel: true } },
                mentor: { select: { user: { select: { email: true } }, expertise: true } },
            },
            orderBy: { scheduledFor: 'asc' },
        });
        return { data: sessions, message: 'Upcoming sessions retrieved successfully' };
    }
    static async getCalendarView(userId, userRole, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        let where = {
            scheduledFor: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (userRole === 'MENTOR') {
            const mentorProfile = await database_1.default.mentorProfile.findUnique({
                where: { userId },
            });
            if (!mentorProfile)
                throw new Error('Mentor profile not found');
            where.mentorId = mentorProfile.id;
        }
        else if (userRole === 'STUDENT') {
            const studentProfile = await database_1.default.studentProfile.findUnique({
                where: { userId },
            });
            if (!studentProfile)
                throw new Error('Student profile not found');
            where.studentId = studentProfile.id;
        }
        const sessions = await database_1.default.mentorshipSession.findMany({
            where,
            include: {
                student: { select: { fullName: true } },
                mentor: { select: { user: { select: { email: true } } } },
            },
            orderBy: { scheduledFor: 'asc' },
        });
        // Group sessions by date
        const calendar = sessions.reduce((acc, session) => {
            const date = session.scheduledFor.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(session);
            return acc;
        }, {});
        return { data: calendar, message: 'Calendar view retrieved successfully' };
    }
    // Helper method to check scheduling conflicts
    static async checkSchedulingConflict(mentorId, scheduledFor, duration, excludeSessionId) {
        const sessionStart = new Date(scheduledFor);
        const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);
        const where = {
            mentorId,
            status: 'SCHEDULED',
            scheduledFor: {
                gte: new Date(sessionStart.getTime() - 180 * 60000), // 3 hours before
                lte: new Date(sessionEnd.getTime() + 180 * 60000), // 3 hours after
            },
        };
        if (excludeSessionId) {
            where.id = { not: excludeSessionId };
        }
        const conflictingSessions = await database_1.default.mentorshipSession.findMany({
            where,
        });
        // Check for actual time overlap
        for (const session of conflictingSessions) {
            const existingStart = new Date(session.scheduledFor);
            const existingEnd = new Date(existingStart.getTime() + session.duration * 60000);
            if ((sessionStart >= existingStart && sessionStart < existingEnd) ||
                (sessionEnd > existingStart && sessionEnd <= existingEnd) ||
                (sessionStart <= existingStart && sessionEnd >= existingEnd)) {
                return true; // Conflict found
            }
        }
        return false; // No conflict
    }
}
exports.MentorshipService = MentorshipService;
//# sourceMappingURL=mentorship.service.js.map