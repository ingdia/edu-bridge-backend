import { Router } from 'express';
import { auditLogController } from '../controllers/auditLog.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/user/:userId', auditLogController.getUserLogs);
router.get('/action/:action', auditLogController.getActionLogs);
router.get('/entity/:entityType/:entityId', auditLogController.getEntityLogs);
router.get('/recent', auditLogController.getRecentLogs);

export default router;
