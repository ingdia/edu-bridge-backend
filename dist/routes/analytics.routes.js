"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/analytics.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)();
// All analytics routes require authentication
router.use(auth_middleware_1.authenticate);
// ─────────────────────────────────────────────────────────────
// ANALYTICS ENDPOINTS (Admin Only)
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/analytics/overview
 * @desc    Get system overview statistics
 * @access  Admin
 */
router.get('/overview', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.getSystemOverview);
/**
 * @route   GET /api/analytics/students/performance
 * @desc    Get student performance analytics
 * @access  Admin, Mentor
 */
router.get('/students/performance', (0, auth_middleware_1.authorize)('ADMIN', 'MENTOR'), analytics_controller_1.AnalyticsController.getStudentPerformance);
/**
 * @route   GET /api/analytics/modules/engagement
 * @desc    Get module engagement analytics
 * @access  Admin
 */
router.get('/modules/engagement', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.getModuleEngagement);
/**
 * @route   GET /api/analytics/mentors/effectiveness
 * @desc    Get mentor effectiveness analytics
 * @access  Admin
 */
router.get('/mentors/effectiveness', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.getMentorEffectiveness);
/**
 * @route   GET /api/analytics/progress-chart
 * @desc    Get progress over time (chart data)
 * @access  Admin, Mentor, Student (own data)
 */
router.get('/progress-chart', analytics_controller_1.AnalyticsController.getProgressChart);
/**
 * @route   GET /api/analytics/applications
 * @desc    Get application statistics
 * @access  Admin
 */
router.get('/applications', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.getApplicationStats);
// ─────────────────────────────────────────────────────────────
// SEARCH ENDPOINTS
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/analytics/search/students?q=query
 * @desc    Search students by name, email, or national ID
 * @access  Admin, Mentor
 */
router.get('/search/students', (0, auth_middleware_1.authorize)('ADMIN', 'MENTOR'), analytics_controller_1.AnalyticsController.searchStudents);
/**
 * @route   GET /api/analytics/search/modules?q=query
 * @desc    Search learning modules
 * @access  Admin, Mentor
 */
router.get('/search/modules', (0, auth_middleware_1.authorize)('ADMIN', 'MENTOR'), analytics_controller_1.AnalyticsController.searchModules);
/**
 * @route   GET /api/analytics/search/opportunities?q=query
 * @desc    Search opportunities
 * @access  Admin, Mentor, Student
 */
router.get('/search/opportunities', analytics_controller_1.AnalyticsController.searchOpportunities);
/**
 * @route   GET /api/analytics/search/global?q=query
 * @desc    Global search across all entities
 * @access  Admin
 */
router.get('/search/global', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.globalSearch);
// ─────────────────────────────────────────────────────────────
// BULK OPERATIONS (Admin Only)
// ─────────────────────────────────────────────────────────────
/**
 * @route   POST /api/analytics/bulk/import-students
 * @desc    Bulk import students from array
 * @access  Admin
 */
router.post('/bulk/import-students', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.bulkImportStudents);
/**
 * @route   POST /api/analytics/bulk/grade-entry
 * @desc    Bulk grade entry for multiple students
 * @access  Admin
 */
router.post('/bulk/grade-entry', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.bulkGradeEntry);
/**
 * @route   POST /api/analytics/bulk/send-notifications
 * @desc    Send notifications to multiple students
 * @access  Admin
 */
router.post('/bulk/send-notifications', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.bulkSendNotifications);
/**
 * @route   POST /api/analytics/bulk/update-user-status
 * @desc    Activate/deactivate multiple users
 * @access  Admin
 */
router.post('/bulk/update-user-status', (0, auth_middleware_1.authorize)('ADMIN'), analytics_controller_1.AnalyticsController.bulkUpdateUserStatus);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map