"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionScheduling_controller_1 = require("../controllers/sessionScheduling.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/create', rbac_middleware_1.requireMentorOrAdmin, sessionScheduling_controller_1.sessionSchedulingController.createSession);
router.put('/reschedule/:sessionId', rbac_middleware_1.requireMentorOrAdmin, sessionScheduling_controller_1.sessionSchedulingController.rescheduleSession);
router.put('/cancel/:sessionId', rbac_middleware_1.requireMentorOrAdmin, sessionScheduling_controller_1.sessionSchedulingController.cancelSession);
router.put('/complete/:sessionId', rbac_middleware_1.requireMentorOrAdmin, sessionScheduling_controller_1.sessionSchedulingController.completeSession);
router.get('/upcoming', sessionScheduling_controller_1.sessionSchedulingController.getUpcomingSessions);
router.post('/weekly-lab', rbac_middleware_1.requireMentorOrAdmin, sessionScheduling_controller_1.sessionSchedulingController.createWeeklyLabSessions);
exports.default = router;
//# sourceMappingURL=sessionScheduling.routes.js.map