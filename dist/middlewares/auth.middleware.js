"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = __importDefault(require("../config/database"));
/**
 * Middleware to verify JWT Access Token (SRS NFR 1: Security)
 */
const authenticate = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Access token is required',
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const payload = (0, jwt_1.verifyToken)(token);
        // Check if user still exists and is active
        const user = await database_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, isActive: true },
        });
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                message: 'User not found or account deactivated',
            });
            return;
        }
        // Attach user to request for downstream use
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to check user role (SRS NFR 10: Privacy & Access Control)
 * @param allowedRoles - Array of roles allowed to access the route
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: 'Access denied: Insufficient permissions',
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map