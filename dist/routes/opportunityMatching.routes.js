"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const opportunityMatching_controller_1 = require("../controllers/opportunityMatching.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/student/:studentId', opportunityMatching_controller_1.opportunityMatchingController.getMatchedOpportunities);
router.get('/opportunity/:opportunityId/top-performers', opportunityMatching_controller_1.opportunityMatchingController.getTopPerformers);
router.get('/score/:studentId/:opportunityId', opportunityMatching_controller_1.opportunityMatchingController.calculateMatchScore);
exports.default = router;
//# sourceMappingURL=opportunityMatching.routes.js.map