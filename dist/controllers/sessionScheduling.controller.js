"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionSchedulingController = void 0;
const sessionScheduling_service_1 = require("../services/sessionScheduling.service");
exports.sessionSchedulingController = {
    async createSession(req, res) {
        try {
            const { mentorId, studentId, scheduledFor, duration, location, notes } = req.body;
            const session = await (0, sessionScheduling_service_1.createMentorshipSession)(mentorId, studentId, new Date(scheduledFor), duration, location, notes);
            res.json({ success: true, data: session });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async rescheduleSession(req, res) {
        try {
            const { sessionId } = req.params;
            const { newDateTime, reason } = req.body;
            const mentorId = req.user.userId;
            const session = await (0, sessionScheduling_service_1.rescheduleSession)(sessionId, mentorId, new Date(newDateTime), reason);
            res.json({ success: true, data: session });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async cancelSession(req, res) {
        try {
            const { sessionId } = req.params;
            const { reason } = req.body;
            const mentorId = req.user.userId;
            const session = await (0, sessionScheduling_service_1.cancelSession)(sessionId, mentorId, reason);
            res.json({ success: true, data: session });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async completeSession(req, res) {
        try {
            const { sessionId } = req.params;
            const { notes, actionItems } = req.body;
            const mentorId = req.user.userId;
            const session = await (0, sessionScheduling_service_1.completeSession)(sessionId, mentorId, notes, actionItems);
            res.json({ success: true, data: session });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getUpcomingSessions(req, res) {
        try {
            const { mentorId, studentId } = req.query;
            let sessions;
            if (mentorId) {
                sessions = await (0, sessionScheduling_service_1.getUpcomingSessions)(mentorId);
            }
            else if (studentId) {
                sessions = await (0, sessionScheduling_service_1.getStudentSessions)(studentId, {
                    status: 'SCHEDULED',
                    startDate: new Date()
                });
            }
            else {
                return res.status(400).json({ success: false, error: 'mentorId or studentId required' });
            }
            res.json({ success: true, data: sessions });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async createWeeklyLabSessions(req, res) {
        try {
            const { mentorId, studentIds, dayOfWeek, time, location } = req.body;
            const scheduledFor = new Date(time);
            const sessions = await (0, sessionScheduling_service_1.createWeeklyLabSession)(mentorId, studentIds, scheduledFor, 120, location || 'Computer Lab');
            res.json({ success: true, data: sessions });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=sessionScheduling.controller.js.map