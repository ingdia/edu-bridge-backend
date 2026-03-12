"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const progress_controller_1 = require("../controllers/progress.controller");
const router = (0, express_1.Router)();
// All progress routes require authentication
router.use(auth_middleware_1.authenticate);
/**
 * @route   POST /api/progress/submit
 * @desc    Submit progress for a learning module
 * @access  Student
 */
router.post('/submit', (0, auth_middleware_1.authorize)('STUDENT'), progress_controller_1.ProgressController.submitProgress);
/**
 * @route   GET /api/progress/me
 * @desc    Get current student's progress dashboard
 * @access  Student
 */
router.get('/me', (0, auth_middleware_1.authorize)('STUDENT'), progress_controller_1.ProgressController.getStudentDashboard);
/**
 * @route   GET /api/progress/mentor/dashboard
 * @desc    Get mentor dashboard: progress of assigned students
 * @access  Mentor
 */
router.get('/mentor/dashboard', (0, auth_middleware_1.authorize)('MENTOR'), progress_controller_1.ProgressController.getMentorDashboard);
/**
 * @route   PATCH /api/progress/:id/feedback
 * @desc    Mentor adds/updates feedback on student progress
 * @access  Mentor
 */
router.patch('/:id/feedback', (0, auth_middleware_1.authorize)('MENTOR'), progress_controller_1.ProgressController.addMentorFeedback);
/**
 * @route   GET /api/progress
 * @desc    Get all progress records (admin only) with filters
 * @access  Admin
 */
router.get('/', (0, auth_middleware_1.authorize)('ADMIN'), progress_controller_1.ProgressController.getAllProgress);
exports.default = router;
//# sourceMappingURL=progress.routes.js.map