import { Router } from 'express';
import { emailSimulationController } from '../controllers/emailSimulation.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/inbox/:studentId', emailSimulationController.getInbox);
router.post('/send/:studentId', emailSimulationController.sendEmail);
router.put('/read/:studentId/:emailId', emailSimulationController.markAsRead);
router.get('/sent/:studentId', emailSimulationController.getSentEmails);

export default router;
