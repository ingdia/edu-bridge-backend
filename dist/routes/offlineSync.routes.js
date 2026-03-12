"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offlineSync_controller_1 = require("../controllers/offlineSync.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/modules/:studentId', offlineSync_controller_1.offlineSyncController.getModulesForOffline);
router.post('/progress', offlineSync_controller_1.offlineSyncController.syncProgress);
router.post('/submissions', offlineSync_controller_1.offlineSyncController.syncSubmissions);
router.get('/unsynced/:studentId', offlineSync_controller_1.offlineSyncController.getUnsyncedData);
router.post('/mark-synced', offlineSync_controller_1.offlineSyncController.markAsSynced);
exports.default = router;
//# sourceMappingURL=offlineSync.routes.js.map