"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const exercise_controller_1 = require("../controllers/exercise.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// All exercise routes require authentication
router.use(auth_middleware_1.authenticate);
/**
 * @route   POST /api/exercises/submit
 * @desc    Submit text-based exercise (LISTENING, READING, WRITING, DIGITAL_LITERACY)
 * @access  Student
 */
router.post('/submit', (0, auth_middleware_1.authorize)('STUDENT'), exercise_controller_1.ExerciseController.submitExercise);
/**
 * @route   POST /api/exercises/submit/speaking
 * @desc    Submit speaking exercise with audio file upload
 * @access  Student
 */
router.post('/submit/speaking', (0, auth_middleware_1.authorize)('STUDENT'), upload_middleware_1.uploadAudio, // Multer middleware for audio files
upload_middleware_1.handleMulterError, // Error handler
exercise_controller_1.ExerciseController.submitSpeakingExercise);
/**
 * @route   GET /api/exercises/me
 * @desc    Get current student's exercise submissions
 * @access  Student
 */
router.get('/me', (0, auth_middleware_1.authorize)('STUDENT'), exercise_controller_1.ExerciseController.getStudentSubmissions);
/**
 * @route   GET /api/exercises/mentor/submissions
 * @desc    Get submissions from assigned students (for review)
 * @access  Mentor
 */
router.get('/mentor/submissions', (0, auth_middleware_1.authorize)('MENTOR'), exercise_controller_1.ExerciseController.getMentorSubmissions);
/**
 * @route   PATCH /api/exercises/:id/evaluate
 * @desc    Mentor evaluates a student submission (score + feedback)
 * @access  Mentor
 */
router.patch('/:id/evaluate', (0, auth_middleware_1.authorize)('MENTOR'), exercise_controller_1.ExerciseController.evaluateSubmission);
/**
 * @route   GET /api/exercises
 * @desc    Admin: Get all submissions with advanced filters
 * @access  Admin
 */
router.get('/', (0, auth_middleware_1.authorize)('ADMIN'), exercise_controller_1.ExerciseController.getAllSubmissions);
exports.default = router;
//# sourceMappingURL=exercise.routes.js.map