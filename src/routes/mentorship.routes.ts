import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { MentorshipController } from '../controllers/mentorship.controller';

const router = Router();

router.use(authenticate);

router.post('/sessions', authorize('MENTOR'), MentorshipController.createSession);
router.patch('/sessions/:id', authorize('MENTOR'), MentorshipController.updateSession);
router.get('/sessions/mentor', authorize('MENTOR'), MentorshipController.getMentorSessions);
router.get('/sessions/student', authorize('STUDENT'), MentorshipController.getStudentSessions);

export default router;
