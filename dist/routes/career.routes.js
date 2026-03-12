"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const career_controller_1 = require("../controllers/career.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/cv', (0, auth_middleware_1.authorize)('STUDENT'), career_controller_1.CareerController.createOrUpdateCV);
router.get('/cv', (0, auth_middleware_1.authorize)('STUDENT'), career_controller_1.CareerController.getStudentCV);
router.post('/applications', (0, auth_middleware_1.authorize)('STUDENT'), career_controller_1.CareerController.createApplication);
router.patch('/applications/:id', (0, auth_middleware_1.authorize)('STUDENT', 'MENTOR'), career_controller_1.CareerController.updateApplicationStatus);
router.get('/applications', (0, auth_middleware_1.authorize)('STUDENT'), career_controller_1.CareerController.getStudentApplications);
exports.default = router;
//# sourceMappingURL=career.routes.js.map