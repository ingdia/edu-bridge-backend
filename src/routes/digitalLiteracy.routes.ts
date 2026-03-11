import { Router } from 'express';
import { digitalLiteracyController } from '../controllers/digitalLiteracy.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  startLessonSchema,
  completeLessonSchema,
  getLessonsQuerySchema,
} from '../validators/digitalLiteracy.validator';

const router = Router();

// Student routes
router.post(
  '/lessons/start',
  authenticate,
  authorize(['STUDENT']),
  validate(startLessonSchema),
  digitalLiteracyController.startLesson.bind(digitalLiteracyController)
);

router.post(
  '/lessons/complete',
  authenticate,
  authorize(['STUDENT']),
  validate(completeLessonSchema),
  digitalLiteracyController.completeLesson.bind(digitalLiteracyController)
);

router.get(
  '/my-progress',
  authenticate,
  authorize(['STUDENT']),
  validate(getLessonsQuerySchema),
  digitalLiteracyController.getMyProgress.bind(digitalLiteracyController)
);

router.get(
  '/my-stats',
  authenticate,
  authorize(['STUDENT']),
  digitalLiteracyController.getMyStats.bind(digitalLiteracyController)
);

// Mentor/Admin routes
router.get(
  '/all-progress',
  authenticate,
  authorize(['MENTOR', 'ADMIN']),
  validate(getLessonsQuerySchema),
  digitalLiteracyController.getAllProgress.bind(digitalLiteracyController)
);

export default router;
