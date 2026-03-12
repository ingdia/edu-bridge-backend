import { Router } from 'express';
import { academicReportScanningController } from '../controllers/academicReportScanning.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireMentorOrAdmin } from '../middlewares/rbac.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);
router.use(requireMentorOrAdmin);

router.post('/scan', upload.single('report'), academicReportScanningController.scanReport);
router.post('/process', upload.single('report'), academicReportScanningController.processReport);
router.put('/correct/:recordId', academicReportScanningController.correctScannedData);
router.get('/student/:studentId', academicReportScanningController.getStudentScannedReports);
router.get('/low-confidence', academicReportScanningController.getLowConfidenceScans);

export default router;
