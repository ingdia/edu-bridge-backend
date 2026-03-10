// src/routes/profile.routes.ts
import prisma from '../config/database';
import { Router } from 'express';
import {
  getMyProfile,
  getStudentProfileById,
  updateMyProfile,
  updateMentorNotesController,
  getAllStudentsController,
} from '../controllers/profile.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ─────────────────────────────────────────────────────────────
// PROTECTED ROUTES (All authenticated users)
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/profile/me
 * @desc    Get current user's profile
 * @access  Private (All roles)
 */
router.get('/me', authenticate, getMyProfile);

/**
 * @route   PUT /api/profile/me
 * @desc    Update current user's profile (basic info only for students)
 * @access  Private (All roles)
 */
router.put('/me', authenticate, updateMyProfile);

// ─────────────────────────────────────────────────────────────
// MENTOR & ADMIN ROUTES (NFR 10: Privacy)
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/profile/students
 * @desc    Get all students (Admin only)
 * @access  Private/Admin
 */
router.get('/students', authenticate, authorize('ADMIN'), getAllStudentsController);

/**
 * @route   GET /api/profile/student/:studentId
 * @desc    Get specific student profile (Mentor/Admin only)
 * @access  Private/Mentor/Admin
 */
router.get(
  '/student/:studentId',
  authenticate,
  authorize('MENTOR', 'ADMIN'),
  getStudentProfileById
);

/**
 * @route   PUT /api/profile/student/:studentId/notes
 * @desc    Update confidential mentor notes (FR 2.5)
 * @access  Private/Mentor/Admin
 */
router.put(
  '/student/:studentId/notes',
  authenticate,
  authorize('MENTOR', 'ADMIN'),
  updateMentorNotesController
);

export default router;