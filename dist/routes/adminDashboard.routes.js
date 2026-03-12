"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminDashboard_controller_1 = require("../controllers/adminDashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use(rbac_middleware_1.requireAdmin);
router.get('/overview', adminDashboard_controller_1.adminDashboardController.getOverview);
router.get('/students/stats', adminDashboard_controller_1.adminDashboardController.getStudentStats);
router.get('/progress/stats', adminDashboard_controller_1.adminDashboardController.getProgressStats);
router.get('/activity', adminDashboard_controller_1.adminDashboardController.getSystemActivity);
router.get('/top-performers', adminDashboard_controller_1.adminDashboardController.getTopPerformers);
router.get('/health', adminDashboard_controller_1.adminDashboardController.getSystemHealth);
exports.default = router;
//# sourceMappingURL=adminDashboard.routes.js.map