"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bulkOperations_controller_1 = require("../controllers/bulkOperations.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rbac_middleware_1 = require("../middlewares/rbac.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use(rbac_middleware_1.requireAdmin);
router.post('/students/import', bulkOperations_controller_1.bulkOperationsController.importStudents);
router.post('/grades/upload', bulkOperations_controller_1.bulkOperationsController.uploadGrades);
router.post('/notifications/send', bulkOperations_controller_1.bulkOperationsController.sendBulkNotifications);
router.post('/mentors/assign', bulkOperations_controller_1.bulkOperationsController.assignMentors);
exports.default = router;
//# sourceMappingURL=bulkOperations.routes.js.map