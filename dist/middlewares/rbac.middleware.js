"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditAction = exports.canAccessStudentData = exports.requireMentorOrAdmin = exports.requireAdmin = exports.requireMentor = exports.requireStudent = exports.requireRole = void 0;
const auditLog_service_1 = require("../services/auditLog.service");
const database_1 = __importDefault(require("../config/database"));
const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }
            if (!allowedRoles.includes(req.user.role)) {
                await auditLog_service_1.auditLogService.log({
                    userId: req.user.userId,
                    action: 'ACCESS_DENIED',
                    details: {
                        attemptedRole: req.user.role,
                        requiredRoles: allowedRoles,
                        path: req.path,
                        method: req.method
                    },
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent')
                });
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRole = requireRole;
exports.requireStudent = (0, exports.requireRole)('STUDENT');
exports.requireMentor = (0, exports.requireRole)('MENTOR', 'ADMIN');
exports.requireAdmin = (0, exports.requireRole)('ADMIN');
exports.requireMentorOrAdmin = (0, exports.requireRole)('MENTOR', 'ADMIN');
const canAccessStudentData = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const targetStudentId = req.params.studentId || req.body.studentId;
        if (req.user.role === 'ADMIN') {
            return next();
        }
        if (req.user.role === 'STUDENT') {
            const studentProfile = await database_1.default.studentProfile.findUnique({
                where: { userId: req.user.userId }
            });
            if (studentProfile?.id !== targetStudentId) {
                await auditLog_service_1.auditLogService.log({
                    userId: req.user.userId,
                    action: 'UNAUTHORIZED_STUDENT_ACCESS',
                    entityType: 'StudentProfile',
                    entityId: targetStudentId,
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent')
                });
                return res.status(403).json({ error: 'Cannot access other student data' });
            }
        }
        if (req.user.role === 'MENTOR') {
            const mentorProfile = await database_1.default.mentorProfile.findUnique({
                where: { userId: req.user.userId },
                include: {
                    assignedStudents: {
                        select: { id: true }
                    }
                }
            });
            const hasAccess = mentorProfile?.assignedStudents.some((s) => s.id === targetStudentId);
            if (!hasAccess) {
                await auditLog_service_1.auditLogService.log({
                    userId: req.user.userId,
                    action: 'UNAUTHORIZED_MENTOR_ACCESS',
                    entityType: 'StudentProfile',
                    entityId: targetStudentId,
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent')
                });
                return res.status(403).json({ error: 'Not assigned to this student' });
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.canAccessStudentData = canAccessStudentData;
const auditAction = (action, entityType) => {
    return async (req, res, next) => {
        try {
            if (req.user) {
                await auditLog_service_1.auditLogService.log({
                    userId: req.user.userId,
                    action,
                    entityType,
                    entityId: req.params.id || req.body.id,
                    details: {
                        method: req.method,
                        path: req.path,
                        body: req.body
                    },
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent')
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.auditAction = auditAction;
//# sourceMappingURL=rbac.middleware.js.map