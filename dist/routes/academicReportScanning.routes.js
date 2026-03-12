"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academicReportScanning_controller_1 = require("../controllers/academicReportScanning.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use(rbac_middleware_1.requireMentorOrAdmin);
router.post('/scan', upload_middleware_1.uploadAcademicReport, academicReportScanning_controller_1.academicReportScanningController.scanReport);
router.post('/process', upload_middleware_1.uploadAcademicReport, academicReportScanning_controller_1.academicReportScanningController.processReport);
router.put('/correct/:recordId', academicReportScanning_controller_1.academicReportScanningController.correctScannedData);
router.get('/student/:studentId', academicReportScanning_controller_1.academicReportScanningController.getStudentScannedReports);
router.get('/low-confidence', academicReportScanning_controller_1.academicReportScanningController.getLowConfidenceScans);
exports.default = router;
//# sourceMappingURL=academicReportScanning.routes.js.map