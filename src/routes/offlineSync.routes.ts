import { Router } from 'express';
import { offlineSyncController } from '../controllers/offlineSync.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/modules/:studentId', offlineSyncController.getModulesForOffline);
router.post('/progress', offlineSyncController.syncProgress);
router.post('/submissions', offlineSyncController.syncSubmissions);
router.get('/unsynced/:studentId', offlineSyncController.getUnsyncedData);
router.post('/mark-synced', offlineSyncController.markAsSynced);

export default router;
