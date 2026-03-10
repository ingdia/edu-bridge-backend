import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { ExerciseController } from '../controllers/exercise.controller';

const router = Router();

// Configure multer for memory storage (for Render compatibility)
// For production: configure multer-s3 or cloud storage adapter
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format. Allowed: mp3, wav, m4a, ogg'));
    }
  },
});

// All exercise routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/exercises/submit
 * @desc    Submit text-based exercise (LISTENING, READING, WRITING, DIGITAL_LITERACY)
 * @access  Student
 */
router.post('/submit', authorize('STUDENT'), ExerciseController.submitExercise);

/**
 * @route   POST /api/exercises/submit/speaking
 * @desc    Submit speaking exercise with audio file upload
 * @access  Student
 */
router.post(
  '/submit/speaking', 
  authorize('STUDENT'), 
  upload.single('audio'), // Field name: 'audio'
  ExerciseController.submitSpeakingExercise
);

/**
 * @route   GET /api/exercises/me
 * @desc    Get current student's exercise submissions
 * @access  Student
 */
router.get('/me', authorize('STUDENT'), ExerciseController.getStudentSubmissions);

/**
 * @route   GET /api/exercises/mentor/submissions
 * @desc    Get submissions from assigned students (for review)
 * @access  Mentor
 */
router.get('/mentor/submissions', authorize('MENTOR'), ExerciseController.getMentorSubmissions);

/**
 * @route   PATCH /api/exercises/:id/evaluate
 * @desc    Mentor evaluates a student submission (score + feedback)
 * @access  Mentor
 */
router.patch('/:id/evaluate', authorize('MENTOR'), ExerciseController.evaluateSubmission);

/**
 * @route   GET /api/exercises
 * @desc    Admin: Get all submissions with advanced filters
 * @access  Admin
 */
router.get('/', authorize('ADMIN'), ExerciseController.getAllSubmissions);

export default router;