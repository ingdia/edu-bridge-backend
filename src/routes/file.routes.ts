// src/routes/file.routes.ts
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { FileController } from '../controllers/file.controller';

const router = Router();

// All file routes require authentication
router.use(authenticate);

// ─────────────────────────────────────────────────────────────
// ACADEMIC REPORT DOWNLOADS
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/files/academic-report/:reportId
 * @desc    Download academic report (PDF/JPEG/PNG)
 * @access  Student (own reports), Mentor (assigned students), Admin
 */
router.get('/academic-report/:reportId', FileController.downloadAcademicReport);

// ─────────────────────────────────────────────────────────────
// AUDIO FILE STREAMING
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/files/audio/submission/:submissionId
 * @desc    Stream audio file from speaking exercise submission
 * @access  Student (own), Mentor (assigned students), Admin
 */
router.get('/audio/submission/:submissionId', FileController.streamAudioSubmission);

/**
 * @route   GET /api/files/audio/module/:moduleId
 * @desc    Stream audio file for listening exercise
 * @access  Student, Mentor, Admin
 */
router.get('/audio/module/:moduleId', FileController.streamModuleAudio);

// ─────────────────────────────────────────────────────────────
// CV/DOCUMENT DOWNLOADS
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/files/cv/:cvId
 * @desc    Download student CV
 * @access  Student (own), Mentor (assigned students), Admin
 */
router.get('/cv/:cvId', FileController.downloadCV);

// ─────────────────────────────────────────────────────────────
// GENERAL FILE ACCESS
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/files/signed-url
 * @desc    Generate temporary signed URL for any Cloudinary file
 * @access  Authenticated users
 */
router.post('/signed-url', FileController.generateSignedUrl);

export default router;
