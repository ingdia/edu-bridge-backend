"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogService = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.auditLogService = {
    async log(data) {
        return await database_1.default.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                details: data.details
            }
        });
    },
    async getUserLogs(userId, limit = 50) {
        return await database_1.default.auditLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            }
        });
    },
    async getActionLogs(action, startDate, endDate) {
        return await database_1.default.auditLog.findMany({
            where: {
                action,
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            }
        });
    },
    async getEntityLogs(entityType, entityId) {
        return await database_1.default.auditLog.findMany({
            where: {
                entityType,
                entityId
            },
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            }
        });
    },
    async getRecentLogs(limit = 100) {
        return await database_1.default.auditLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            }
        });
    }
};
//# sourceMappingURL=auditLog.service.js.map