import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { CareerController } from '../controllers/career.controller';

const router = Router();

router.use(authenticate);

router.post('/cv', authorize('STUDENT'), CareerController.createOrUpdateCV);
router.get('/cv', authorize('STUDENT'), CareerController.getStudentCV);
router.post('/applications', authorize('STUDENT'), CareerController.createApplication);
router.patch('/applications/:id', authorize('STUDENT', 'MENTOR'), CareerController.updateApplicationStatus);
router.get('/applications', authorize('STUDENT'), CareerController.getStudentApplications);

export default router;
