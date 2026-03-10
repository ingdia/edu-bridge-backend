import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { CreateSessionInput, UpdateSessionInput } from '../validators/mentorship.validator';

export class MentorshipService {
  static async createSession(data: CreateSessionInput, mentorUserId: string) {
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentorProfile) {
      throw new Error('Mentor profile not found');
    }

    const session = await prisma.mentorshipSession.create({
      data: {
        ...data,
        mentorId: mentorProfile.id,
      },
      include: {
        student: { select: { fullName: true } },
      },
    });

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

  static async getMentorSessions(mentorUserId: string) {
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
    });

    if (!mentorProfile) {
      throw new Error('Mentor profile not found');
    }

    const sessions = await prisma.mentorshipSession.findMany({
      where: { mentorId: mentorProfile.id },
      include: {
        student: { select: { fullName: true, gradeLevel: true } },
      },
      orderBy: { scheduledFor: 'desc' },
    });

    return { data: sessions, message: 'Sessions retrieved successfully' };
  }

  static async getStudentSessions(studentUserId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const sessions = await prisma.mentorshipSession.findMany({
      where: { studentId: studentProfile.id },
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
}
