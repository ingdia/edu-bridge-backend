"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
// src/services/auth.service.ts
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const logger_1 = require("../utils/logger");
const registerUser = async (data, ipAddress) => {
    const { email, password, role, fullName, nationalId, dateOfBirth, gradeLevel, guardianName, guardianContact } = data;
    // FR 1.1: Check if email already exists
    const existingUser = await database_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error('Email already registered');
    }
    // FR 1.2: Hash password securely (NFR 1)
    const hashedPassword = await (0, password_1.hashPassword)(password);
    // Create user with role (SRS 2.3: User Classes)
    const user = await database_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role,
        },
    });
    // FR 2: Create student profile if role is STUDENT
    if (role === 'STUDENT' && fullName && nationalId && dateOfBirth) {
        await database_1.default.studentProfile.create({
            data: {
                userId: user.id,
                fullName,
                dateOfBirth: new Date(dateOfBirth),
                gradeLevel: gradeLevel || 'Senior Four',
                nationalId,
                guardianName: guardianName || null,
                guardianContact: guardianContact || null,
            },
        });
    }
    // Generate JWT tokens
    const accessToken = (0, jwt_1.generateAccessToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = (0, jwt_1.generateRefreshToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    // Store refresh token in database (for revocation support)
    await database_1.default.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            ipAddress: ipAddress || null,
        },
    });
    // NFR 5: Audit logging
    await (0, logger_1.logAudit)(user.id, 'USER_REGISTER', { email, role }, ipAddress);
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data, ipAddress) => {
    const { email, password } = data;
    // FR 1.1: Find user by email
    const user = await database_1.default.user.findUnique({
        where: { email },
        include: {
            studentProfile: {
                select: {
                    fullName: true,
                },
            },
        },
    });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    // FR 1.2: Verify password (NFR 1: Security)
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Check if account is active
    if (!user.isActive) {
        throw new Error('Account is deactivated. Contact administrator.');
    }
    // Generate JWT tokens
    const accessToken = (0, jwt_1.generateAccessToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = (0, jwt_1.generateRefreshToken)({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    // Store refresh token in database
    await database_1.default.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            ipAddress: ipAddress || null,
        },
    });
    // Update last login timestamp
    await database_1.default.user.update({
        where: { id: user.id },
        data: {
            lastLogin: new Date(),
        },
    });
    // NFR 5: Audit logging
    await (0, logger_1.logAudit)(user.id, 'USER_LOGIN', { email, role: user.role }, ipAddress);
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.studentProfile?.fullName || undefined,
        },
        accessToken,
        refreshToken,
    };
};
exports.loginUser = loginUser;
// ─────────────────────────────────────────────────────────────
// LOGOUT SERVICE (NFR 5: Auditability)
// ─────────────────────────────────────────────────────────────
const logoutUser = async (userId, token, ipAddress) => {
    // Revoke refresh token
    await database_1.default.refreshToken.updateMany({
        where: {
            userId,
            token,
            revoked: false,
        },
        data: {
            revoked: true,
        },
    });
    // NFR 5: Audit logging
    await (0, logger_1.logAudit)(userId, 'USER_LOGOUT', { tokenRevoked: true }, ipAddress);
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=auth.service.js.map