"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const opportunity_controller_1 = require("../controllers/opportunity.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const opportunity_validator_1 = require("../validators/opportunity.validator");
const router = (0, express_1.Router)();
// Public/Student routes
router.get('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(opportunity_validator_1.getOpportunitiesQuerySchema), opportunity_controller_1.opportunityController.getOpportunities.bind(opportunity_controller_1.opportunityController));
router.get('/matched', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), opportunity_controller_1.opportunityController.getMatchedOpportunities.bind(opportunity_controller_1.opportunityController));
router.get('/:id', auth_middleware_1.authenticate, opportunity_controller_1.opportunityController.getOpportunityById.bind(opportunity_controller_1.opportunityController));
router.post('/:id/apply', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('STUDENT'), opportunity_controller_1.opportunityController.incrementApplyCount.bind(opportunity_controller_1.opportunityController));
// Admin routes
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), (0, validate_middleware_1.validate)(opportunity_validator_1.createOpportunitySchema), opportunity_controller_1.opportunityController.createOpportunity.bind(opportunity_controller_1.opportunityController));
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), (0, validate_middleware_1.validate)(opportunity_validator_1.updateOpportunitySchema), opportunity_controller_1.opportunityController.updateOpportunity.bind(opportunity_controller_1.opportunityController));
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), opportunity_controller_1.opportunityController.deleteOpportunity.bind(opportunity_controller_1.opportunityController));
exports.default = router;
//# sourceMappingURL=opportunity.routes.js.map