"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkOperationsController = void 0;
const bulkOperations_service_1 = require("../services/bulkOperations.service");
exports.bulkOperationsController = {
    async importStudents(req, res) {
        try {
            const { students } = req.body;
            const createdBy = req.user.userId;
            const result = await bulkOperations_service_1.bulkOperationsService.importStudents(students, createdBy);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async uploadGrades(req, res) {
        try {
            const { grades } = req.body;
            const uploadedBy = req.user.userId;
            const result = await bulkOperations_service_1.bulkOperationsService.uploadGrades(grades, uploadedBy);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async sendBulkNotifications(req, res) {
        try {
            const notificationData = req.body;
            const sentBy = req.user.userId;
            const result = await bulkOperations_service_1.bulkOperationsService.sendBulkNotifications(notificationData, sentBy);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async assignMentors(req, res) {
        try {
            const { assignments } = req.body;
            const result = await bulkOperations_service_1.bulkOperationsService.assignMentorsToStudents(assignments);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=bulkOperations.controller.js.map