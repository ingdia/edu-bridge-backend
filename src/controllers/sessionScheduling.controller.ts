import { Request, Response } from 'express';
import {
  createMentorshipSession,
  createWeeklyLabSession,
  rescheduleSession,
  cancelSession,
  completeSession,
  getUpcomingSessions,
  getMentorSessions,
  getStudentSessions
} from '../services/sessionScheduling.service';

export const sessionSchedulingController = {
  async createSession(req: Request, res: Response) {
    try {
      const { mentorId, studentId, scheduledFor, duration, location, notes } = req.body;

      const session = await createMentorshipSession(
        mentorId,
        studentId,
        new Date(scheduledFor),
        duration,
        location,
        notes
      );
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async rescheduleSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const { newDateTime, reason } = req.body;
      const mentorId = (req as any).user.userId;

      const session = await rescheduleSession(
        sessionId,
        mentorId,
        new Date(newDateTime),
        reason
      );
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async cancelSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const { reason } = req.body;
      const mentorId = (req as any).user.userId;

      const session = await cancelSession(sessionId, mentorId, reason);
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async completeSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const { notes, actionItems } = req.body;
      const mentorId = (req as any).user.userId;

      const session = await completeSession(sessionId, mentorId, notes, actionItems);
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getUpcomingSessions(req: Request, res: Response) {
    try {
      const { mentorId, studentId } = req.query;

      let sessions;
      if (mentorId) {
        sessions = await getUpcomingSessions(mentorId as string);
      } else if (studentId) {
        sessions = await getStudentSessions(studentId as string, {
          status: 'SCHEDULED',
          startDate: new Date()
        });
      } else {
        return res.status(400).json({ success: false, error: 'mentorId or studentId required' });
      }

      res.json({ success: true, data: sessions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async createWeeklyLabSessions(req: Request, res: Response) {
    try {
      const { mentorId, studentIds, dayOfWeek, time, location } = req.body;

      const scheduledFor = new Date(time);
      const sessions = await createWeeklyLabSession(
        mentorId,
        studentIds,
        scheduledFor,
        120,
        location || 'Computer Lab'
      );
      res.json({ success: true, data: sessions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
