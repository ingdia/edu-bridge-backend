"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ─────────────────────────────────────────────────────────────
// PROTECTED ROUTES (All authenticated users)
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/profile/me
 * @desc    Get current user's profile
 * @access  Private (All roles)
 */
router.get('/me', auth_middleware_1.authenticate, profile_controller_1.getMyProfile);
/**
 * @route   PUT /api/profile/me
 * @desc    Update current user's profile (basic info only for students)
 * @access  Private (All roles)
 */
router.put('/me', auth_middleware_1.authenticate, profile_controller_1.updateMyProfile);
// ─────────────────────────────────────────────────────────────
// MENTOR & ADMIN ROUTES (NFR 10: Privacy)
// ─────────────────────────────────────────────────────────────
/**
 * @route   GET /api/profile/students
 * @desc    Get all students (Admin only)
 * @access  Private/Admin
 */
router.get('/students', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), profile_controller_1.getAllStudentsController);
/**
 * @route   GET /api/profile/student/:studentId
 * @desc    Get specific student profile (Mentor/Admin only)
 * @access  Private/Mentor/Admin
 */
router.get('/student/:studentId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('MENTOR', 'ADMIN'), profile_controller_1.getStudentProfileById);
/**
 * @route   PUT /api/profile/student/:studentId/notes
 * @desc    Update confidential mentor notes (FR 2.5)
 * @access  Private/Mentor/Admin
 */
router.put('/student/:studentId/notes', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('MENTOR', 'ADMIN'), profile_controller_1.updateMentorNotesController);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map