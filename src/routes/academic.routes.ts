import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { AcademicReportController } from '../controllers/academic.controller';

const router = Router();

router.use(authenticate);

router.post('/upload', authorize('ADMIN'), AcademicReportController.uploadReport);
router.post('/manual', authorize('ADMIN'), AcademicReportController.manualEntry);
router.get('/student/:studentId', authorize('ADMIN', 'MENTOR'), AcademicReportController.getStudentReports);

export default router;
