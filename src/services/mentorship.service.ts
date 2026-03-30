import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { CreateSessionInput, UpdateSessionInput, RescheduleSessionInput, CancelSessionInput, GetSessionsQuery } from '../validators/mentorship.validator';
import { notificationService } from './notification.service';

export class MentorshipService {
  static async createSession(data: CreateSessionInput, mentorUserId: string) {
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentorProfile) {
      throw new Error('Mentor profile not found');
    }

    // Check if student exists
    const student = await prisma.studentProfile.findUnique({
      where: { id: data.studentId },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Check for scheduling conflicts
    const conflict = await this.checkSchedulingConflict(
      mentorProfile.id,
      data.scheduledFor,
      data.duration || 60
    );

    if (conflict) {
      throw new Error('Scheduling conflict: You already have a session at this time');
    }

    const session = await prisma.mentorshipSession.create({
      data: {
        ...data,
        mentorId: mentorProfile.id,
      },
      include: {
        student: { select: { fullName: true, user: { select: { email: true } } } },
      },
    });

    // Send notification to student
    await notificationService.createSessionReminder(
      data.studentId,
      {
        id: session.id,
        scheduledFor: session.scheduledFor,
        duration: session.duration,
        location: session.location,
      },
      mentorProfile.id
    );

    await logAudit(mentorUserId, 'SESSION_CREATE', { sessionId: session.id });

    return { data: session, message: 'Session scheduled successfully' };
  }

  static async updateSession(sessionId: string, data: UpdateSessionInput, mentorUserId: string) {
    const session = await prisma.mentorshipSession.update({
      where: { id: sessionId },
      data,
      include: {
        student: { select: { fullName: true } },
      },
    });

    await logAudit(mentorUserId, 'SESSION_UPDATE', { sessionId, status: data.status });

    return { data: session, message: 'Session updated successfully' };
  }

  static async rescheduleSession(
    sessionId: string,
    data: RescheduleSessionInput,
    mentorUserId: string
  ) {
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentorProfile) {
      throw new Error('Mentor profile not found');
    }

    // Get existing session
    const existingSession = await prisma.mentorshipSession.findUnique({
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
    const conflict = await this.checkSchedulingConflict(
      mentorProfile.id,
      data.scheduledFor,
      data.duration || existingSession.duration,
      sessionId // Exclude current session from conflict check
    );

    if (conflict) {
      throw new Error('Scheduling conflict: You already have a session at this time');
    }

    const updatedSession = await prisma.mentorshipSession.update({
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
    await notificationService.createNotification({
      recipientId: existingSession.studentId,
      type: 'SESSION_REMINDER',
      title: 'Session Rescheduled',
      message: `Your mentorship session has been rescheduled to ${new Date(data.scheduledFor).toLocaleString()}`,
      actionUrl: `/mentorship/sessions/${sessionId}`,
      sentByMentorId: mentorProfile.id,
      sendEmail: true,
    });

    await logAudit(mentorUserId, 'SESSION_RESCHEDULE', {
      sessionId,
      oldTime: existingSession.scheduledFor,
      newTime: data.scheduledFor,
    });

    return { data: updatedSession, message: 'Session rescheduled successfully' };
  }

  static async cancelSession(
    sessionId: string,
    data: CancelSessionInput,
    userId: string,
    userRole: string
  ) {
    const session = await prisma.mentorshipSession.findUnique({
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
      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId },
      });
      if (!mentorProfile || session.mentorId !== mentorProfile.id) {
        throw new Error('Unauthorized: You can only cancel your own sessions');
      }
    } else if (userRole === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
      });
      if (!studentProfile || session.studentId !== studentProfile.id) {
        throw new Error('Unauthorized: You can only cancel your own sessions');
      }
    }

    if (session.status !== 'SCHEDULED') {
      throw new Error('Can only cancel sessions with SCHEDULED status');
    }

    const cancelledSession = await prisma.mentorshipSession.update({
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
      await notificationService.createNotification({
        recipientId: session.studentId,
        type: 'SESSION_REMINDER',
        title: 'Session Cancelled',
        message: `Your mentorship session scheduled for ${new Date(session.scheduledFor).toLocaleString()} has been cancelled. Reason: ${data.reason}`,
        sentByMentorId: session.mentorId,
        sendEmail: true,
      });
    }

    await logAudit(userId, 'SESSION_CANCEL', { sessionId, reason: data.reason });

    return { data: cancelledSession, message: 'Session cancelled successfully' };
  }

  static async getMentorSessions(mentorUserId: string, filters?: GetSessionsQuery) {
    let mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentorProfile) {
      mentorProfile = await prisma.mentorProfile.create({
        data: { userId: mentorUserId, expertise: [] },
      });
    }

    const where: any = { mentorId: mentorProfile.id };

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

    const sessions = await prisma.mentorshipSession.findMany({
      where,
      include: {
        student: { select: { fullName: true, gradeLevel: true } },
      },
      orderBy: { scheduledFor: 'desc' },
    });

    return { data: sessions, message: 'Sessions retrieved successfully' };
  }

  static async getStudentSessions(studentUserId: string, filters?: GetSessionsQuery) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const where: any = { studentId: studentProfile.id };

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

    const sessions = await prisma.mentorshipSession.findMany({
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

  static async getUpcomingSessions(userId: string, userRole: string) {
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    let where: any = {
      status: 'SCHEDULED',
      scheduledFor: {
        gte: now,
        lte: oneWeekFromNow,
      },
    };

    if (userRole === 'MENTOR') {
      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId },
      });
      if (!mentorProfile) throw new Error('Mentor profile not found');
      where.mentorId = mentorProfile.id;
    } else if (userRole === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
      });
      if (!studentProfile) throw new Error('Student profile not found');
      where.studentId = studentProfile.id;
    }

    const sessions = await prisma.mentorshipSession.findMany({
      where,
      include: {
        student: { select: { fullName: true, gradeLevel: true } },
        mentor: { select: { user: { select: { email: true } }, expertise: true } },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    return { data: sessions, message: 'Upcoming sessions retrieved successfully' };
  }

  static async getCalendarView(userId: string, userRole: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    let where: any = {
      scheduledFor: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userRole === 'MENTOR') {
      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId },
      });
      if (!mentorProfile) throw new Error('Mentor profile not found');
      where.mentorId = mentorProfile.id;
    } else if (userRole === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
      });
      if (!studentProfile) throw new Error('Student profile not found');
      where.studentId = studentProfile.id;
    }

    const sessions = await prisma.mentorshipSession.findMany({
      where,
      include: {
        student: { select: { fullName: true } },
        mentor: { select: { user: { select: { email: true } } } },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    // Group sessions by date
    const calendar = sessions.reduce((acc: any, session) => {
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
  private static async checkSchedulingConflict(
    mentorId: string,
    scheduledFor: Date,
    duration: number,
    excludeSessionId?: string
  ): Promise<boolean> {
    const sessionStart = new Date(scheduledFor);
    const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);

    const where: any = {
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

    const conflictingSessions = await prisma.mentorshipSession.findMany({
      where,
    });

    // Check for actual time overlap
    for (const session of conflictingSessions) {
      const existingStart = new Date(session.scheduledFor);
      const existingEnd = new Date(existingStart.getTime() + session.duration * 60000);

      if (
        (sessionStart >= existingStart && sessionStart < existingEnd) ||
        (sessionEnd > existingStart && sessionEnd <= existingEnd) ||
        (sessionStart <= existingStart && sessionEnd >= existingEnd)
      ) {
        return true; // Conflict found
      }
    }

    return false; // No conflict
  }
}
