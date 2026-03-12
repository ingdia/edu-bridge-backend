// src/routes/analytics.routes.ts
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// ─────────────────────────────────────────────────────────────
// ANALYTICS ENDPOINTS (Admin Only)
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/analytics/overview
 * @desc    Get system overview statistics
 * @access  Admin
 */
router.get('/overview', authorize('ADMIN'), AnalyticsController.getSystemOverview);

/**
 * @route   GET /api/analytics/students/performance
 * @desc    Get student performance analytics
 * @access  Admin, Mentor
 */
router.get('/students/performance', authorize('ADMIN', 'MENTOR'), AnalyticsController.getStudentPerformance);

/**
 * @route   GET /api/analytics/modules/engagement
 * @desc    Get module engagement analytics
 * @access  Admin
 */
router.get('/modules/engagement', authorize('ADMIN'), AnalyticsController.getModuleEngagement);

/**
 * @route   GET /api/analytics/mentors/effectiveness
 * @desc    Get mentor effectiveness analytics
 * @access  Admin
 */
router.get('/mentors/effectiveness', authorize('ADMIN'), AnalyticsController.getMentorEffectiveness);

/**
 * @route   GET /api/analytics/progress-chart
 * @desc    Get progress over time (chart data)
 * @access  Admin, Mentor, Student (own data)
 */
router.get('/progress-chart', AnalyticsController.getProgressChart);

/**
 * @route   GET /api/analytics/applications
 * @desc    Get application statistics
 * @access  Admin
 */
router.get('/applications', authorize('ADMIN'), AnalyticsController.getApplicationStats);

// ─────────────────────────────────────────────────────────────
// SEARCH ENDPOINTS
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/analytics/search/students?q=query
 * @desc    Search students by name, email, or national ID
 * @access  Admin, Mentor
 */
router.get('/search/students', authorize('ADMIN', 'MENTOR'), AnalyticsController.searchStudents);

/**
 * @route   GET /api/analytics/search/modules?q=query
 * @desc    Search learning modules
 * @access  Admin, Mentor
 */
router.get('/search/modules', authorize('ADMIN', 'MENTOR'), AnalyticsController.searchModules);

/**
 * @route   GET /api/analytics/search/opportunities?q=query
 * @desc    Search opportunities
 * @access  Admin, Mentor, Student
 */
router.get('/search/opportunities', AnalyticsController.searchOpportunities);

/**
 * @route   GET /api/analytics/search/global?q=query
 * @desc    Global search across all entities
 * @access  Admin
 */
router.get('/search/global', authorize('ADMIN'), AnalyticsController.globalSearch);

// ─────────────────────────────────────────────────────────────
// BULK OPERATIONS (Admin Only)
// ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/analytics/bulk/import-students
 * @desc    Bulk import students from array
 * @access  Admin
 */
router.post('/bulk/import-students', authorize('ADMIN'), AnalyticsController.bulkImportStudents);

/**
 * @route   POST /api/analytics/bulk/grade-entry
 * @desc    Bulk grade entry for multiple students
 * @access  Admin
 */
router.post('/bulk/grade-entry', authorize('ADMIN'), AnalyticsController.bulkGradeEntry);

/**
 * @route   POST /api/analytics/bulk/send-notifications
 * @desc    Send notifications to multiple students
 * @access  Admin
 */
router.post('/bulk/send-notifications', authorize('ADMIN'), AnalyticsController.bulkSendNotifications);

/**
 * @route   POST /api/analytics/bulk/update-user-status
 * @desc    Activate/deactivate multiple users
 * @access  Admin
 */
router.post('/bulk/update-user-status', authorize('ADMIN'), AnalyticsController.bulkUpdateUserStatus);

export default router;
