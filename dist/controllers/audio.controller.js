"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioController = void 0;
const fileUpload_1 = require("../utils/fileUpload");
const database_1 = __importDefault(require("../config/database"));
exports.audioController = {
    async uploadAudio(req, res) {
        try {
            const { studentId, moduleId, exerciseType } = req.body;
            const audioFile = req.file;
            if (!audioFile) {
                return res.status(400).json({ success: false, error: 'No audio file uploaded' });
            }
            const result = await (0, fileUpload_1.uploadToCloudinary)(audioFile.buffer, audioFile.originalname, 'AUDIO');
            const submission = await database_1.default.exerciseSubmission.create({
                data: {
                    studentId,
                    moduleId,
                    exerciseType: exerciseType || 'SPEAKING',
                    submissionContent: {
                        audioUrl: result.url,
                        recordingDuration: req.body.duration || null,
                        transcript: req.body.transcript || null
                    },
                    status: 'pending'
                }
            });
            res.json({ success: true, data: { audioUrl: result.url, submission } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getAudioSubmissions(req, res) {
        try {
            const { studentId } = req.params;
            const exerciseType = req.query.exerciseType;
            const whereClause = { studentId };
            if (exerciseType) {
                whereClause.exerciseType = exerciseType;
            }
            const submissions = await database_1.default.exerciseSubmission.findMany({
                where: whereClause,
                include: {
                    module: {
                        select: {
                            title: true,
                            type: true
                        }
                    }
                },
                orderBy: { submittedAt: 'desc' }
            });
            res.json({ success: true, data: submissions });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async evaluateAudio(req, res) {
        try {
            const { submissionId } = req.params;
            const { score, feedback, rubricScores } = req.body;
            const evaluatorId = req.user.userId;
            const mentorProfile = await database_1.default.mentorProfile.findUnique({
                where: { userId: evaluatorId }
            });
            if (!mentorProfile) {
                return res.status(403).json({ success: false, error: 'Only mentors can evaluate' });
            }
            const submission = await database_1.default.exerciseSubmission.update({
                where: { id: submissionId },
                data: {
                    score,
                    feedback,
                    rubricScores,
                    isPassed: score >= 60,
                    evaluatedAt: new Date(),
                    evaluatedBy: mentorProfile.id,
                    status: 'evaluated'
                }
            });
            res.json({ success: true, data: submission });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getListeningExercises(req, res) {
        try {
            const modules = await database_1.default.learningModule.findMany({
                where: {
                    type: 'LISTENING',
                    isActive: true
                },
                orderBy: { orderIndex: 'asc' }
            });
            res.json({ success: true, data: modules });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
//# sourceMappingURL=audio.controller.js.map