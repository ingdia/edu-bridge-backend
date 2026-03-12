"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ─────────────────────────────────────────────────────────────
// PUBLIC ROUTES (No authentication required)
// ─────────────────────────────────────────────────────────────
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (student, mentor, or admin)
 * @access  Public
 * @body    email, password, role, fullName, nationalId, dateOfBirth
 */
router.post('/register', auth_controller_1.register);
/**
 * @route   POST /api/auth/login
 * @desc    Login user and receive JWT tokens
 * @access  Public
 * @body    email, password
 */
router.post('/login', auth_controller_1.login);
/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    refreshToken
 */
router.post('/refresh-token', auth_controller_1.refreshToken);
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
router.post('/logout', auth_middleware_1.authenticate, auth_controller_1.logout);
/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 * @header  Authorization: Bearer <access_token>
 */
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getCurrentUser);
// ─────────────────────────────────────────────────────────────
// ADMIN-ONLY ROUTES (SRS 2.3: User Classes)
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/auth/admin/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/admin/users', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res) => {
    // Placeholder - will implement in Admin Service
    res.json({ message: 'Admin users endpoint - coming soon' });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map