import { Router } from 'express';
import { audioController } from '../controllers/audio.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadAudio } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

router.post('/upload', uploadAudio, audioController.uploadAudio);
router.get('/submissions/:studentId', audioController.getAudioSubmissions);
router.put('/evaluate/:submissionId', audioController.evaluateAudio);
router.get('/listening-exercises', audioController.getListeningExercises);

export default router;
