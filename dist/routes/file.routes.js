"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/file.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const file_controller_1 = require("../controllers/file.controller");
const router = (0, express_1.Router)();
// All file routes require authentication
router.use(auth_middleware_1.authenticate);
// ─────────────────────────────────────────────────────────────
// ACADEMIC REPORT DOWNLOADS
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/files/academic-report/:reportId
 * @desc    Download academic report (PDF/JPEG/PNG)
 * @access  Student (own reports), Mentor (assigned students), Admin
 */
router.get('/academic-report/:reportId', file_controller_1.FileController.downloadAcademicReport);
// ─────────────────────────────────────────────────────────────
// AUDIO FILE STREAMING
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/files/audio/submission/:submissionId
 * @desc    Stream audio file from speaking exercise submission
 * @access  Student (own), Mentor (assigned students), Admin
 */
router.get('/audio/submission/:submissionId', file_controller_1.FileController.streamAudioSubmission);
/**
 * @route   GET /api/files/audio/module/:moduleId
 * @desc    Stream audio file for listening exercise
 * @access  Student, Mentor, Admin
 */
router.get('/audio/module/:moduleId', file_controller_1.FileController.streamModuleAudio);
// ─────────────────────────────────────────────────────────────
// CV/DOCUMENT DOWNLOADS
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/files/cv/:cvId
 * @desc    Download student CV
 * @access  Student (own), Mentor (assigned students), Admin
 */
router.get('/cv/:cvId', file_controller_1.FileController.downloadCV);
// ─────────────────────────────────────────────────────────────
// GENERAL FILE ACCESS
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/files/signed-url
 * @desc    Generate temporary signed URL for any Cloudinary file
 * @access  Authenticated users
 */
router.post('/signed-url', file_controller_1.FileController.generateSignedUrl);
exports.default = router;
//# sourceMappingURL=file.routes.js.map