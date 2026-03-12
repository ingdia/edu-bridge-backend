import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

router.get('/', healthController.getHealth);
router.get('/database', healthController.getDatabaseHealth);
router.get('/system', healthController.getSystemMetrics);
router.get('/data', healthController.getDataMetrics);

export default router;
