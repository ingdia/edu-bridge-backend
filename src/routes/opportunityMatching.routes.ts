import { Router } from 'express';
import { opportunityMatchingController } from '../controllers/opportunityMatching.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/student/:studentId', opportunityMatchingController.getMatchedOpportunities);
router.get('/opportunity/:opportunityId/top-performers', opportunityMatchingController.getTopPerformers);
router.get('/score/:studentId/:opportunityId', opportunityMatchingController.calculateMatchScore);

export default router;
