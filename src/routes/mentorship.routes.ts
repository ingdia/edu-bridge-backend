import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { MentorshipController } from '../controllers/mentorship.controller';

const router = Router();

router.use(authenticate);

// Session scheduling (Mentor only)
router.post('/sessions', authorize('MENTOR'), MentorshipController.createSession);
router.patch('/sessions/:id', authorize('MENTOR'), MentorshipController.updateSession);
router.patch('/sessions/:id/reschedule', authorize('MENTOR'), MentorshipController.rescheduleSession);

// Session cancellation (Both mentor and student)
router.delete('/sessions/:id/cancel', authorize('MENTOR', 'STUDENT'), MentorshipController.cancelSession);

// Get sessions with filters
router.get('/sessions/mentor', authorize('MENTOR'), MentorshipController.getMentorSessions);
router.get('/sessions/student', authorize('STUDENT'), MentorshipController.getStudentSessions);

// Upcoming sessions (next 7 days)
router.get('/sessions/upcoming', authorize('MENTOR', 'STUDENT'), MentorshipController.getUpcomingSessions);

// Calendar view (monthly)
router.get('/calendar', authorize('MENTOR', 'STUDENT'), MentorshipController.getCalendarView);

export default router;
