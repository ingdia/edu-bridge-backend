import { Router } from 'express';
import { adminDashboardController } from '../controllers/adminDashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/overview', adminDashboardController.getOverview);
router.get('/students/stats', adminDashboardController.getStudentStats);
router.get('/progress/stats', adminDashboardController.getProgressStats);
router.get('/activity', adminDashboardController.getSystemActivity);
router.get('/top-performers', adminDashboardController.getTopPerformers);
router.get('/health', adminDashboardController.getSystemHealth);
router.get('/users', adminDashboardController.getAllUsers);
router.patch('/users/:userId/toggle-status', adminDashboardController.toggleUserStatus);

export default router;
