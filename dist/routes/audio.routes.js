"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audio_controller_1 = require("../controllers/audio.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/upload', upload_middleware_1.uploadAudio, audio_controller_1.audioController.uploadAudio);
router.get('/submissions/:studentId', audio_controller_1.audioController.getAudioSubmissions);
router.put('/evaluate/:submissionId', audio_controller_1.audioController.evaluateAudio);
router.get('/listening-exercises', audio_controller_1.audioController.getListeningExercises);
exports.default = router;
//# sourceMappingURL=audio.routes.js.map