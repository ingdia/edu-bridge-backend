import { Request, Response } from 'express';
import { uploadToCloudinary } from '../utils/fileUpload';
import prisma from '../config/database';

export const audioController = {
  async uploadAudio(req: Request, res: Response) {
    try {
      const { studentId, moduleId, exerciseType } = req.body;
      const audioFile = req.file;

      if (!audioFile) {
        return res.status(400).json({ success: false, error: 'No audio file uploaded' });
      }

      const result = await uploadToCloudinary(
        audioFile.buffer,
        audioFile.originalname,
        'AUDIO'
      );

      const submission = await prisma.exerciseSubmission.create({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getAudioSubmissions(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const exerciseType = req.query.exerciseType as string;

      const whereClause: any = { studentId };
      if (exerciseType) {
        whereClause.exerciseType = exerciseType;
      }

      const submissions = await prisma.exerciseSubmission.findMany({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async evaluateAudio(req: Request, res: Response) {
    try {
      const { submissionId } = req.params;
      const { score, feedback, rubricScores } = req.body;
      const evaluatorId = (req as any).user.userId;

      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId: evaluatorId }
      });

      if (!mentorProfile) {
        return res.status(403).json({ success: false, error: 'Only mentors can evaluate' });
      }

      const submission = await prisma.exerciseSubmission.update({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getListeningExercises(req: Request, res: Response) {
    try {
      const modules = await prisma.learningModule.findMany({
        where: {
          type: 'LISTENING',
          isActive: true
        },
        orderBy: { orderIndex: 'asc' }
      });

      res.json({ success: true, data: modules });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
