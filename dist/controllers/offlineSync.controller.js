"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineSyncController = void 0;
const offlineSync_service_1 = require("../services/offlineSync.service");
exports.offlineSyncController = {
    async getModulesForOffline(req, res) {
        try {
            const { studentId } = req.params;
            const modules = await offlineSync_service_1.offlineSyncService.getModulesForOffline(studentId);
            res.json({ success: true, data: modules });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async syncProgress(req, res) {
        try {
            const { progressData } = req.body;
            const results = await offlineSync_service_1.offlineSyncService.syncProgress(progressData);
            res.json({ success: true, data: results });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async syncSubmissions(req, res) {
        try {
            const { submissions } = req.body;
            const results = await offlineSync_service_1.offlineSyncService.syncSubmissions(submissions);
            res.json({ success: true, data: results });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getUnsyncedData(req, res) {
        try {
            const { studentId } = req.params;
            const progress = await offlineSync_service_1.offlineSyncService.getUnsyncedProgress(studentId);
            const submissions = await offlineSync_service_1.offlineSyncService.getUnsyncedSubmissions(studentId);
            res.json({ success: true, data: { progress, submissions } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async markAsSynced(req, res) {
        try {
            const { progressIds, submissionIds } = req.body;
            const result = await offlineSync_service_1.offlineSyncService.markAsSynced(progressIds, submissionIds);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=offlineSync.controller.js.map