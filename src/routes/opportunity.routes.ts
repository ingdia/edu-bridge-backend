import { Router } from 'express';
import { opportunityController } from '../controllers/opportunity.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createOpportunitySchema,
  updateOpportunitySchema,
  getOpportunitiesQuerySchema,
} from '../validators/opportunity.validator';

const router = Router();

// Public/Student routes
router.get(
  '/',
  authenticate,
  validate(getOpportunitiesQuerySchema),
  opportunityController.getOpportunities.bind(opportunityController)
);

router.get(
  '/matched',
  authenticate,
  authorize('STUDENT'),
  opportunityController.getMatchedOpportunities.bind(opportunityController)
);

router.get(
  '/:id',
  authenticate,
  opportunityController.getOpportunityById.bind(opportunityController)
);

router.post(
  '/:id/apply',
  authenticate,
  authorize('STUDENT'),
  opportunityController.incrementApplyCount.bind(opportunityController)
);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createOpportunitySchema),
  opportunityController.createOpportunity.bind(opportunityController)
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateOpportunitySchema),
  opportunityController.updateOpportunity.bind(opportunityController)
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  opportunityController.deleteOpportunity.bind(opportunityController)
);

export default router;
