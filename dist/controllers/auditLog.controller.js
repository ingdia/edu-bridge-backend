"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogController = void 0;
const auditLog_service_1 = require("../services/auditLog.service");
exports.auditLogController = {
    async getUserLogs(req, res) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit) || 50;
            const logs = await auditLog_service_1.auditLogService.getUserLogs(userId, limit);
            res.json({ success: true, data: logs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getActionLogs(req, res) {
        try {
            const { action } = req.params;
            const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
            const logs = await auditLog_service_1.auditLogService.getActionLogs(action, startDate, endDate);
            res.json({ success: true, data: logs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getEntityLogs(req, res) {
        try {
            const { entityType, entityId } = req.params;
            const logs = await auditLog_service_1.auditLogService.getEntityLogs(entityType, entityId);
            res.json({ success: true, data: logs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getRecentLogs(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const logs = await auditLog_service_1.auditLogService.getRecentLogs(limit);
            res.json({ success: true, data: logs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=auditLog.controller.js.map