import { Router } from 'express';
import { bulkOperationsController } from '../controllers/bulkOperations.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/students/import', bulkOperationsController.importStudents);
router.post('/grades/upload', bulkOperationsController.uploadGrades);
router.post('/notifications/send', bulkOperationsController.sendBulkNotifications);
router.post('/mentors/assign', bulkOperationsController.assignMentors);

export default router;
