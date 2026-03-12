// src/services/sessionScheduling.service.ts
import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { notificationService } from './notification.service';

// ─────────────────────────────────────────────────────────────
// CREATE MENTORSHIP SESSION
// ─────────────────────────────────────────────────────────────

export const createMentorshipSession = async (
  mentorId: string,
  studentId: string,
  scheduledFor: Date,
  duration: number = 60,
  location?: string,
  notes?: string
) => {
  // Verify student exists
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: { select: { email: true } } }
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Check for scheduling conflicts
  const conflict = await prisma.mentorshipSession.findFirst({
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
  const session = await prisma.mentorshipSession.create({
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
  await notificationService.createSessionReminder(
    studentId,
    {
      id: session.id,
      scheduledFor: session.scheduledFor,
      location: session.location,
      duration: session.duration
    },
    mentorId
  );

  await logAudit(mentorId, 'SESSION_CREATE', {
    sessionId: session.id,
    studentId,
    scheduledFor
  });

  return session;
};

// ─────────────────────────────────────────────────────────────
// CREATE WEEKLY LAB SESSION (BULK)
// ─────────────────────────────────────────────────────────────

export const createWeeklyLabSession = async (
  mentorId: string,
  studentIds: string[],
  scheduledFor: Date,
  duration: number = 120,
  location: string = 'Computer Lab',
  notes?: string
) => {
  const sessions = [];

  for (const studentId of studentIds) {
    try {
      const session = await createMentorshipSession(
        mentorId,
        studentId,
        scheduledFor,
        duration,
        location,
        notes
      );
      sessions.push(session);
    } catch (error) {
      console.error(`[SESSION_CREATE_ERROR] Student ${studentId}:`, error);
    }
  }

  await logAudit(mentorId, 'SESSION_CREATE', {
    type: 'weekly_lab',
    count: sessions.length,
    scheduledFor
  });

  return sessions;
};

// ─────────────────────────────────────────────────────────────
// RESCHEDULE SESSION
// ─────────────────────────────────────────────────────────────

export const rescheduleSession = async (
  sessionId: string,
  mentorId: string,
  newScheduledFor: Date,
  reason?: string
) => {
  const session = await prisma.mentorshipSession.findUnique({
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
  const conflict = await prisma.mentorshipSession.findFirst({
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
  const updated = await prisma.mentorshipSession.update({
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
  await notificationService.createNotification({
    recipientId: session.studentId,
    type: 'SESSION_REMINDER',
    title: 'Session Rescheduled',
    message: `Your mentorship session has been rescheduled to ${newScheduledFor.toLocaleString()}${reason ? `. Reason: ${reason}` : ''}`,
    actionUrl: `/mentorship/sessions/${sessionId}`,
    sentByMentorId: mentorId,
    sendEmail: true
  });

  await logAudit(mentorId, 'SESSION_RESCHEDULE', {
    sessionId,
    oldTime: session.scheduledFor,
    newTime: newScheduledFor,
    reason
  });

  return updated;
};

// ─────────────────────────────────────────────────────────────
// CANCEL SESSION
// ─────────────────────────────────────────────────────────────

export const cancelSession = async (
  sessionId: string,
  mentorId: string,
  reason?: string
) => {
  const session = await prisma.mentorshipSession.findUnique({
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
  const updated = await prisma.mentorshipSession.update({
    where: { id: sessionId },
    data: {
      status: 'CANCELLED',
      notes: reason ? `${session.notes || ''}\nCancelled: ${reason}` : session.notes
    }
  });

  // Notify student
  await notificationService.createNotification({
    recipientId: session.studentId,
    type: 'SESSION_REMINDER',
    title: 'Session Cancelled',
    message: `Your mentorship session scheduled for ${session.scheduledFor.toLocaleString()} has been cancelled${reason ? `. Reason: ${reason}` : ''}`,
    sentByMentorId: mentorId,
    sendEmail: true
  });

  await logAudit(mentorId, 'SESSION_CANCEL', {
    sessionId,
    scheduledFor: session.scheduledFor,
    reason
  });

  return updated;
};

// ─────────────────────────────────────────────────────────────
// COMPLETE SESSION
// ─────────────────────────────────────────────────────────────

export const completeSession = async (
  sessionId: string,
  mentorId: string,
  notes?: string,
  actionItems?: string
) => {
  const session = await prisma.mentorshipSession.findUnique({
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
  const updated = await prisma.mentorshipSession.update({
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

  await logAudit(mentorId, 'SESSION_UPDATE', {
    sessionId,
    status: 'COMPLETED'
  });

  return updated;
};

// ─────────────────────────────────────────────────────────────
// GET MENTOR'S SESSIONS
// ─────────────────────────────────────────────────────────────

export const getMentorSessions = async (
  mentorId: string,
  filters?: {
    status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    startDate?: Date;
    endDate?: Date;
    studentId?: string;
  }
) => {
  const where: any = { mentorId };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.scheduledFor = {};
    if (filters.startDate) where.scheduledFor.gte = filters.startDate;
    if (filters.endDate) where.scheduledFor.lte = filters.endDate;
  }

  if (filters?.studentId) {
    where.studentId = filters.studentId;
  }

  const sessions = await prisma.mentorshipSession.findMany({
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

// ─────────────────────────────────────────────────────────────
// GET STUDENT'S SESSIONS
// ─────────────────────────────────────────────────────────────

export const getStudentSessions = async (
  studentId: string,
  filters?: {
    status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    startDate?: Date;
    endDate?: Date;
  }
) => {
  const where: any = { studentId };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.scheduledFor = {};
    if (filters.startDate) where.scheduledFor.gte = filters.startDate;
    if (filters.endDate) where.scheduledFor.lte = filters.endDate;
  }

  const sessions = await prisma.mentorshipSession.findMany({
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

// ─────────────────────────────────────────────────────────────
// GET UPCOMING SESSIONS (NEXT 7 DAYS)
// ─────────────────────────────────────────────────────────────

export const getUpcomingSessions = async (mentorId: string) => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return await prisma.mentorshipSession.findMany({
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
