import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { ProgressController } from '../controllers/progress.controller';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/progress/submit
 * @desc    Submit progress for a learning module
 * @access  Student
 */
router.post('/submit', authorize('STUDENT'), ProgressController.submitProgress);

/**
 * @route   GET /api/progress/me
 * @desc    Get current student's progress dashboard
 * @access  Student
 */
router.get('/me', authorize('STUDENT'), ProgressController.getStudentDashboard);

/**
 * @route   GET /api/progress/mentor/dashboard
 * @desc    Get mentor dashboard: progress of assigned students
 * @access  Mentor
 */
router.get('/mentor/dashboard', authorize('MENTOR'), ProgressController.getMentorDashboard);

/**
 * @route   PATCH /api/progress/:id/feedback
 * @desc    Mentor adds/updates feedback on student progress
 * @access  Mentor
 */
router.patch('/:id/feedback', authorize('MENTOR'), ProgressController.addMentorFeedback);

/**
 * @route   GET /api/progress
 * @desc    Get all progress records (admin only) with filters
 * @access  Admin
 */
router.get('/', authorize('ADMIN'), ProgressController.getAllProgress);

export default router;