"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSimulationController = void 0;
const emailSimulation_service_1 = require("../services/emailSimulation.service");
exports.emailSimulationController = {
    async getInbox(req, res) {
        try {
            const { studentId } = req.params;
            const emails = await emailSimulation_service_1.emailSimulationService.getInbox(studentId);
            res.json({ success: true, data: emails });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async sendEmail(req, res) {
        try {
            const { studentId } = req.params;
            const draft = req.body;
            const result = await emailSimulation_service_1.emailSimulationService.sendEmail(studentId, draft);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async markAsRead(req, res) {
        try {
            const { studentId, emailId } = req.params;
            await emailSimulation_service_1.emailSimulationService.markAsRead(studentId, emailId);
            res.json({ success: true, message: 'Email marked as read' });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getSentEmails(req, res) {
        try {
            const { studentId } = req.params;
            const emails = await emailSimulation_service_1.emailSimulationService.getSentEmails(studentId);
            res.json({ success: true, data: emails });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=emailSimulation.controller.js.map