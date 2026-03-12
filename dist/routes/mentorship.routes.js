"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const mentorship_controller_1 = require("../controllers/mentorship.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Session scheduling (Mentor only)
router.post('/sessions', (0, auth_middleware_1.authorize)('MENTOR'), mentorship_controller_1.MentorshipController.createSession);
router.patch('/sessions/:id', (0, auth_middleware_1.authorize)('MENTOR'), mentorship_controller_1.MentorshipController.updateSession);
router.patch('/sessions/:id/reschedule', (0, auth_middleware_1.authorize)('MENTOR'), mentorship_controller_1.MentorshipController.rescheduleSession);
// Session cancellation (Both mentor and student)
router.delete('/sessions/:id/cancel', (0, auth_middleware_1.authorize)('MENTOR', 'STUDENT'), mentorship_controller_1.MentorshipController.cancelSession);
// Get sessions with filters
router.get('/sessions/mentor', (0, auth_middleware_1.authorize)('MENTOR'), mentorship_controller_1.MentorshipController.getMentorSessions);
router.get('/sessions/student', (0, auth_middleware_1.authorize)('STUDENT'), mentorship_controller_1.MentorshipController.getStudentSessions);
// Upcoming sessions (next 7 days)
router.get('/sessions/upcoming', (0, auth_middleware_1.authorize)('MENTOR', 'STUDENT'), mentorship_controller_1.MentorshipController.getUpcomingSessions);
// Calendar view (monthly)
router.get('/calendar', (0, auth_middleware_1.authorize)('MENTOR', 'STUDENT'), mentorship_controller_1.MentorshipController.getCalendarView);
exports.default = router;
//# sourceMappingURL=mentorship.routes.js.map