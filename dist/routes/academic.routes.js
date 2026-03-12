"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const academic_controller_1 = require("../controllers/academic.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Upload academic report with file
router.post('/upload', (0, auth_middleware_1.authorize)('ADMIN'), upload_middleware_1.uploadAcademicReport, upload_middleware_1.handleMulterError, academic_controller_1.AcademicReportController.uploadReport);
// Manual entry without file
router.post('/manual', (0, auth_middleware_1.authorize)('ADMIN'), academic_controller_1.AcademicReportController.manualEntry);
// Get student reports
router.get('/student/:studentId', (0, auth_middleware_1.authorize)('ADMIN', 'MENTOR'), academic_controller_1.AcademicReportController.getStudentReports);
// Delete report
router.delete('/:reportId', (0, auth_middleware_1.authorize)('ADMIN'), academic_controller_1.AcademicReportController.deleteReport);
exports.default = router;
//# sourceMappingURL=academic.routes.js.map