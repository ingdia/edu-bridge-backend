"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const academic_controller_1 = require("../controllers/academic.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/upload', (0, auth_middleware_1.authorize)('ADMIN'), academic_controller_1.AcademicReportController.uploadReport);
router.post('/manual', (0, auth_middleware_1.authorize)('ADMIN'), academic_controller_1.AcademicReportController.manualEntry);
router.get('/student/:studentId', (0, auth_middleware_1.authorize)('ADMIN', 'MENTOR'), academic_controller_1.AcademicReportController.getStudentReports);
exports.default = router;
//# sourceMappingURL=academic.routes.js.map