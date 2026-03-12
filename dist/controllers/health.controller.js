"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
const healthMonitoring_service_1 = require("../services/healthMonitoring.service");
exports.healthController = {
    async getHealth(req, res) {
        try {
            const report = await healthMonitoring_service_1.healthMonitoringService.getFullHealthReport();
            const statusCode = report.status === 'healthy' ? 200 : 503;
            res.status(statusCode).json({ success: true, data: report });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getDatabaseHealth(req, res) {
        try {
            const health = await healthMonitoring_service_1.healthMonitoringService.checkDatabaseHealth();
            res.json({ success: true, data: health });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getSystemMetrics(req, res) {
        try {
            const metrics = await healthMonitoring_service_1.healthMonitoringService.getSystemMetrics();
            res.json({ success: true, data: metrics });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getDataMetrics(req, res) {
        try {
            const metrics = await healthMonitoring_service_1.healthMonitoringService.getDataMetrics();
            res.json({ success: true, data: metrics });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=health.controller.js.map