"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
router.get('/', health_controller_1.healthController.getHealth);
router.get('/database', health_controller_1.healthController.getDatabaseHealth);
router.get('/system', health_controller_1.healthController.getSystemMetrics);
router.get('/data', health_controller_1.healthController.getDataMetrics);
exports.default = router;
//# sourceMappingURL=health.routes.js.map