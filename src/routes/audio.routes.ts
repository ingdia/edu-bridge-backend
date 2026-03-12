import { Router } from 'express';
import { audioController } from '../controllers/audio.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

router.post('/upload', upload.single('audio'), audioController.uploadAudio);
router.get('/submissions/:studentId', audioController.getAudioSubmissions);
router.put('/evaluate/:submissionId', audioController.evaluateAudio);
router.get('/listening-exercises', audioController.getListeningExercises);

export default router;
