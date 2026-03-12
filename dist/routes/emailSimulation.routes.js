"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailSimulation_controller_1 = require("../controllers/emailSimulation.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/inbox/:studentId', emailSimulation_controller_1.emailSimulationController.getInbox);
router.post('/send/:studentId', emailSimulation_controller_1.emailSimulationController.sendEmail);
router.put('/read/:studentId/:emailId', emailSimulation_controller_1.emailSimulationController.markAsRead);
router.get('/sent/:studentId', emailSimulation_controller_1.emailSimulationController.getSentEmails);
exports.default = router;
//# sourceMappingURL=emailSimulation.routes.js.map