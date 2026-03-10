// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, logout, refreshToken, getCurrentUser } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ─────────────────────────────────────────────────────────────
// PUBLIC ROUTES (No authentication required)
// ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (student, mentor, or admin)
 * @access  Public
 * @body    email, password, role, fullName, nationalId, dateOfBirth
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and receive JWT tokens
 * @access  Public
 * @body    email, password
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    refreshToken
 */
router.post('/refresh-token', refreshToken);

// ─────────────────────────────────────────────────────────────
// PROTECTED ROUTES (Authentication required)
// ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and revoke refresh token
 * @access  Private
 * @header  Authorization: Bearer <access_token>
 * @body    refreshToken
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 * @header  Authorization: Bearer <access_token>
 */
router.get('/me', authenticate, getCurrentUser);

// ─────────────────────────────────────────────────────────────
// ADMIN-ONLY ROUTES (SRS 2.3: User Classes)
// ─────────────────────────────────────────────────────────────

/**
 * @route   GET /api/auth/admin/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/admin/users', authenticate, authorize('ADMIN'), async (req, res) => {
  // Placeholder - will implement in Admin Service
  res.json({ message: 'Admin users endpoint - coming soon' });
});

export default router;