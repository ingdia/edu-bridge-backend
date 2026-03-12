"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditLog_controller_1 = require("../controllers/auditLog.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use(rbac_middleware_1.requireAdmin);
router.get('/user/:userId', auditLog_controller_1.auditLogController.getUserLogs);
router.get('/action/:action', auditLog_controller_1.auditLogController.getActionLogs);
router.get('/entity/:entityType/:entityId', auditLog_controller_1.auditLogController.getEntityLogs);
router.get('/recent', auditLog_controller_1.auditLogController.getRecentLogs);
exports.default = router;
//# sourceMappingURL=auditLog.routes.js.map