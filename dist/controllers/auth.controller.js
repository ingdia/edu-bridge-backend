"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // ← ADD THIS IMPORT
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
const env_1 = require("../config/env"); // ← Also import env for JWT_SECRET
// ─────────────────────────────────────────────────────────────
// REGISTER CONTROLLER (SRS FR 1, FR 2)
// ─────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
    try {
        const validatedData = (0, auth_validator_1.validateRegister)(req.body);
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const result = await (0, auth_service_1.registerUser)(validatedData, ipAddress);
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// ─────────────────────────────────────────────────────────────
// LOGIN CONTROLLER (SRS FR 1.1, FR 1.2)
// ─────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
    try {
        const validatedData = (0, auth_validator_1.validateLogin)(req.body);
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        const result = await (0, auth_service_1.loginUser)(validatedData, ipAddress);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// ─────────────────────────────────────────────────────────────
// LOGOUT CONTROLLER (NFR 5: Auditability)
// ─────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
            return;
        }
        const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
        await (0, auth_service_1.logoutUser)(userId, refreshToken, ipAddress);
        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
// ─────────────────────────────────────────────────────────────
// REFRESH TOKEN CONTROLLER
// ─────────────────────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = (0, auth_validator_1.validateRefreshToken)(req.body);
        // Verify the refresh token
        const payload = (0, jwt_1.verifyToken)(refreshToken);
        // Check if token exists in database and is not revoked
        const storedToken = await database_1.default.refreshToken.findFirst({
            where: {
                token: refreshToken,
                userId: payload.userId,
                revoked: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!storedToken) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
            return;
        }
        // Generate new access token
        const newAccessToken = jsonwebtoken_1.default.sign({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        }, env_1.env.JWT_SECRET, // ← Use env.JWT_SECRET instead of process.env
        { expiresIn: '15m' });
        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
// ─────────────────────────────────────────────────────────────
// GET CURRENT USER CONTROLLER (FR 1: Authentication)
// ─────────────────────────────────────────────────────────────
const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                studentProfile: {
                    select: {
                        fullName: true,
                        nationalId: true,
                        schoolName: true,
                        gradeLevel: true,
                    },
                },
                mentorProfile: {
                    select: {
                        expertise: true,
                        bio: true,
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.controller.js.map