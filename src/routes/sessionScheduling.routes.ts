import { Router } from 'express';
import { sessionSchedulingController } from '../controllers/sessionScheduling.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireMentorOrAdmin } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.post('/create', requireMentorOrAdmin, sessionSchedulingController.createSession);
router.put('/reschedule/:sessionId', requireMentorOrAdmin, sessionSchedulingController.rescheduleSession);
router.put('/cancel/:sessionId', requireMentorOrAdmin, sessionSchedulingController.cancelSession);
router.put('/complete/:sessionId', requireMentorOrAdmin, sessionSchedulingController.completeSession);
router.get('/upcoming', sessionSchedulingController.getUpcomingSessions);
router.post('/weekly-lab', requireMentorOrAdmin, sessionSchedulingController.createWeeklyLabSessions);

export default router;
