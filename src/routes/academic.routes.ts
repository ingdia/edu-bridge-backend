import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { AcademicReportController } from '../controllers/academic.controller';
import { uploadAcademicReport, handleMulterError } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

// Upload academic report with file
router.post(
  '/upload',
  authorize('ADMIN'),
  uploadAcademicReport,
  handleMulterError,
  AcademicReportController.uploadReport
);

// Manual entry without file
router.post('/manual', authorize('ADMIN'), AcademicReportController.manualEntry);

// Get student reports
router.get('/student/:studentId', authorize('ADMIN', 'MENTOR'), AcademicReportController.getStudentReports);

// Delete report
router.delete('/:reportId', authorize('ADMIN'), AcademicReportController.deleteReport);

export default router;
