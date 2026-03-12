"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudentsController = exports.updateMentorNotesController = exports.updateMyProfile = exports.getStudentProfileById = exports.getMyProfile = void 0;
// src/controllers/profile.controller.ts
const database_1 = __importDefault(require("../config/database"));
const profile_service_1 = require("../services/profile.service");
const profile_validator_1 = require("../validators/profile.validator");
// ─────────────────────────────────────────────────────────────
// GET CURRENT USER PROFILE (SRS FR 2, FR 6.1)
// ─────────────────────────────────────────────────────────────
const getMyProfile = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const profile = await (0, profile_service_1.getStudentProfile)(userId, userRole);
        res.status(200).json({
            success: true,
            data: { profile },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyProfile = getMyProfile;
// ─────────────────────────────────────────────────────────────
// GET SPECIFIC STUDENT PROFILE (Mentor/Admin Only)
// ─────────────────────────────────────────────────────────────
const getStudentProfileById = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const userRole = req.user?.role;
        // Fetch user ID from studentId
        const student = await database_1.default.user.findUnique({
            where: { id: studentId },
            select: { id: true },
        });
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Student not found',
            });
            return;
        }
        const profile = await (0, profile_service_1.getStudentProfile)(studentId, userRole);
        res.status(200).json({
            success: true,
            data: { profile },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentProfileById = getStudentProfileById;
// ─────────────────────────────────────────────────────────────
// UPDATE MY PROFILE (SRS FR 2.1 - 2.4)
// ─────────────────────────────────────────────────────────────
const updateMyProfile = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const requesterId = req.user?.userId;
        const requesterRole = req.user?.role;
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const validatedData = (0, profile_validator_1.validateUpdateProfile)(req.body);
        const profile = await (0, profile_service_1.updateStudentProfile)(userId, validatedData, requesterId, requesterRole, ipAddress);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { profile },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMyProfile = updateMyProfile;
// ─────────────────────────────────────────────────────────────
// UPDATE MENTOR NOTES (FR 2.5 - Mentor/Admin Only)
// ─────────────────────────────────────────────────────────────
const updateMentorNotesController = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const requesterId = req.user?.userId;
        const requesterRole = req.user?.role;
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const validatedData = (0, profile_validator_1.validateMentorNotes)(req.body);
        const profile = await (0, profile_service_1.updateMentorNotes)(studentId, validatedData, requesterId, requesterRole, ipAddress);
        res.status(200).json({
            success: true,
            message: 'Mentor notes updated successfully',
            data: { profile },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMentorNotesController = updateMentorNotesController;
// ─────────────────────────────────────────────────────────────
// GET ALL STUDENTS (Admin Only - SRS 2.3)
// ─────────────────────────────────────────────────────────────
const getAllStudentsController = async (req, res, next) => {
    try {
        const requesterId = req.user?.userId;
        const { district, gradeLevel } = req.query;
        const filters = {};
        if (district)
            filters.district = district;
        if (gradeLevel)
            filters.gradeLevel = gradeLevel;
        const students = await (0, profile_service_1.getAllStudents)(requesterId, filters);
        res.status(200).json({
            success: true,
            data: { students, count: students.length },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllStudentsController = getAllStudentsController;
//# sourceMappingURL=profile.controller.js.map