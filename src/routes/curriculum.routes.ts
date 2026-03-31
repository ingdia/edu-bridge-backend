import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import prisma from '../config/database';

const router = Router();

// ─── Helper: resolve mentorProfile from userId ────────────────
async function getMentorProfile(userId: string) {
  let profile = await prisma.mentorProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!profile) {
    profile = await prisma.mentorProfile.create({ data: { userId, expertise: [] }, select: { id: true } });
  }
  return profile;
}

async function getStudentProfile(userId: string) {
  return prisma.studentProfile.findUnique({ where: { userId }, select: { id: true } });
}

// ═══════════════════════════════════════════════════════════════
// MENTOR: WEEKLY PLAN MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// GET /api/curriculum/my-modules — mentor sees their assigned modules with weekly plans
router.get('/my-modules', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const mentor = await getMentorProfile(req.user!.userId);
    const modules = await prisma.mentorModule.findMany({
      where: { mentorId: mentor.id },
      include: {
        module: { select: { id: true, title: true, type: true, difficulty: true, description: true } },
        weeklyPlans: {
          orderBy: { weekNumber: 'asc' },
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
            quizzes: { select: { id: true, title: true, isPublished: true, passMark: true } },
          },
        },
      },
    });
    res.json({ success: true, data: modules });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/curriculum/:mentorModuleId/weeks — create a week
router.post('/:mentorModuleId/weeks', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const mentor = await getMentorProfile(req.user!.userId);
    const mm = await prisma.mentorModule.findFirst({
      where: { id: req.params.mentorModuleId, mentorId: mentor.id },
    });
    if (!mm) return res.status(404).json({ success: false, message: 'Module assignment not found' });

    const { weekNumber, title, description } = req.body;
    const week = await prisma.weeklyPlan.create({
      data: { mentorModuleId: mm.id, weekNumber, title, description },
    });
    res.status(201).json({ success: true, data: week });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// PATCH /api/curriculum/weeks/:weekId — update week (title, description, publish)
router.patch('/weeks/:weekId', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const { title, description, isPublished } = req.body;
    const week = await prisma.weeklyPlan.update({
      where: { id: req.params.weekId },
      data: { ...(title && { title }), ...(description !== undefined && { description }), ...(isPublished !== undefined && { isPublished }) },
    });
    res.json({ success: true, data: week });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// DELETE /api/curriculum/weeks/:weekId
router.delete('/weeks/:weekId', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    await prisma.weeklyPlan.delete({ where: { id: req.params.weekId } });
    res.json({ success: true, message: 'Week deleted' });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── LESSONS ──────────────────────────────────────────────────

// POST /api/curriculum/weeks/:weekId/lessons
router.post('/weeks/:weekId/lessons', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const { title, contentType, contentUrl, description, durationMin, orderIndex } = req.body;
    const lesson = await prisma.weekLesson.create({
      data: { weeklyPlanId: req.params.weekId, title, contentType, contentUrl, description, durationMin, orderIndex: orderIndex ?? 0 },
    });
    res.status(201).json({ success: true, data: lesson });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// PATCH /api/curriculum/lessons/:lessonId
router.patch('/lessons/:lessonId', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const lesson = await prisma.weekLesson.update({ where: { id: req.params.lessonId }, data: req.body });
    res.json({ success: true, data: lesson });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// DELETE /api/curriculum/lessons/:lessonId
router.delete('/lessons/:lessonId', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    await prisma.weekLesson.delete({ where: { id: req.params.lessonId } });
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── QUIZZES ──────────────────────────────────────────────────

// POST /api/curriculum/weeks/:weekId/quizzes
router.post('/weeks/:weekId/quizzes', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const { title, instructions, passMark, maxAttempts, questions } = req.body;
    const quiz = await prisma.mentorQuiz.create({
      data: {
        weeklyPlanId: req.params.weekId,
        title,
        instructions,
        passMark: passMark ?? 50,
        maxAttempts: maxAttempts ?? 3,
        questions: questions?.length ? {
          create: questions.map((q: any, i: number) => ({
            orderIndex: i,
            questionText: q.questionText,
            questionType: q.questionType ?? 'multiple_choice',
            options: q.options ?? null,
            correctAnswer: q.correctAnswer ?? null,
            marks: q.marks ?? 1,
          })),
        } : undefined,
      },
      include: { questions: { orderBy: { orderIndex: 'asc' } } },
    });
    res.status(201).json({ success: true, data: quiz });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// PATCH /api/curriculum/quizzes/:quizId — update quiz meta or publish
router.patch('/quizzes/:quizId', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const quiz = await prisma.mentorQuiz.update({ where: { id: req.params.quizId }, data: req.body });
    res.json({ success: true, data: quiz });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// DELETE /api/curriculum/quizzes/:quizId
router.delete('/quizzes/:quizId', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    await prisma.mentorQuiz.delete({ where: { id: req.params.quizId } });
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/curriculum/quizzes/:quizId/submissions — mentor sees all student submissions
router.get('/quizzes/:quizId/submissions', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const submissions = await prisma.quizSubmission.findMany({
      where: { quizId: req.params.quizId },
      include: { student: { select: { fullName: true, gradeLevel: true } } },
      orderBy: { submittedAt: 'desc' },
    });
    res.json({ success: true, data: submissions });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// PATCH /api/curriculum/submissions/:submissionId/grade — mentor grades a submission
router.patch('/submissions/:submissionId/grade', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const mentor = await getMentorProfile(req.user!.userId);
    const { score, feedback } = req.body;

    const submission = await prisma.quizSubmission.findUnique({
      where: { id: req.params.submissionId },
      include: { quiz: { select: { passMark: true, weeklyPlanId: true } } },
    });
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    const isPassed = score >= submission.quiz.passMark;

    const updated = await prisma.quizSubmission.update({
      where: { id: req.params.submissionId },
      data: { score, feedback, isPassed, status: 'graded', gradedAt: new Date(), gradedBy: mentor.id },
    });

    // If passed, unlock the next week for this student
    if (isPassed) {
      const currentWeek = await prisma.weeklyPlan.findUnique({
        where: { id: submission.quiz.weeklyPlanId },
        select: { weekNumber: true, mentorModuleId: true },
      });
      if (currentWeek) {
        // Mark current week as completed
        await prisma.studentWeekProgress.upsert({
          where: { weeklyPlanId_studentId: { weeklyPlanId: submission.quiz.weeklyPlanId, studentId: submission.studentId } },
          create: { weeklyPlanId: submission.quiz.weeklyPlanId, studentId: submission.studentId, isUnlocked: true, isCompleted: true, completedAt: new Date() },
          update: { isCompleted: true, completedAt: new Date() },
        });
        // Unlock next week
        const nextWeek = await prisma.weeklyPlan.findFirst({
          where: { mentorModuleId: currentWeek.mentorModuleId, weekNumber: currentWeek.weekNumber + 1 },
        });
        if (nextWeek) {
          await prisma.studentWeekProgress.upsert({
            where: { weeklyPlanId_studentId: { weeklyPlanId: nextWeek.id, studentId: submission.studentId } },
            create: { weeklyPlanId: nextWeek.id, studentId: submission.studentId, isUnlocked: true, unlockedAt: new Date() },
            update: { isUnlocked: true, unlockedAt: new Date() },
          });
        }
      }
    }

    res.json({ success: true, data: updated, message: isPassed ? 'Passed — next week unlocked' : 'Graded — student did not pass' });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// ═══════════════════════════════════════════════════════════════
// STUDENT: VIEW CURRICULUM & SUBMIT QUIZZES
// ═══════════════════════════════════════════════════════════════

// GET /api/curriculum/student — student sees their mentor's curriculum
router.get('/student', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const student = await getStudentProfile(req.user!.userId);
    if (!student) return res.status(200).json({ success: true, data: [] });

    const profile = await prisma.studentProfile.findUnique({
      where: { id: student.id },
      select: { assignedMentorId: true },
    });
    if (!profile?.assignedMentorId) return res.status(200).json({ success: true, data: [] });

    const modules = await prisma.mentorModule.findMany({
      where: { mentorId: profile.assignedMentorId },
      include: {
        module: { select: { id: true, title: true, type: true, difficulty: true, description: true } },
        weeklyPlans: {
          where: { isPublished: true },
          orderBy: { weekNumber: 'asc' },
          include: {
            lessons: { orderBy: { orderIndex: 'asc' } },
            quizzes: {
              where: { isPublished: true },
              select: { id: true, title: true, passMark: true, maxAttempts: true, instructions: true },
            },
            studentProgress: {
              where: { studentId: student.id },
              select: { isUnlocked: true, isCompleted: true, unlockedAt: true, completedAt: true },
            },
          },
        },
      },
    });

    // Mark week 1 as unlocked by default if no progress exists
    const enriched = modules.map((m) => ({
      ...m,
      weeklyPlans: m.weeklyPlans.map((w, idx) => ({
        ...w,
        progress: w.studentProgress[0] ?? { isUnlocked: idx === 0, isCompleted: false },
      })),
    }));

    res.json({ success: true, data: enriched });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/curriculum/quizzes/:quizId — student gets quiz questions (without correct answers)
router.get('/quizzes/:quizId', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const quiz = await prisma.mentorQuiz.findUnique({
      where: { id: req.params.quizId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          select: { id: true, orderIndex: true, questionText: true, questionType: true, options: true, marks: true },
          // correctAnswer intentionally excluded for students
        },
      },
    });
    if (!quiz || !quiz.isPublished) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// POST /api/curriculum/quizzes/:quizId/submit — student submits quiz
router.post('/quizzes/:quizId/submit', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const student = await getStudentProfile(req.user!.userId);
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const { answers } = req.body; // { questionId: answer }

    const quiz = await prisma.mentorQuiz.findUnique({
      where: { id: req.params.quizId },
      include: { questions: true },
    });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Check attempt count
    const attemptCount = await prisma.quizSubmission.count({
      where: { quizId: quiz.id, studentId: student.id },
    });
    if (attemptCount >= quiz.maxAttempts) {
      return res.status(400).json({ success: false, message: `Maximum ${quiz.maxAttempts} attempts reached` });
    }

    // Auto-grade multiple choice questions
    let autoScore = 0;
    let totalMarks = 0;
    let hasOpenEnded = false;

    for (const q of quiz.questions) {
      totalMarks += q.marks;
      if (q.questionType === 'multiple_choice' && q.correctAnswer) {
        if (answers[q.id] === q.correctAnswer) autoScore += q.marks;
      } else {
        hasOpenEnded = true;
      }
    }

    const scorePct = totalMarks > 0 ? Math.round((autoScore / totalMarks) * 100) : null;
    const isPassed = !hasOpenEnded && scorePct !== null ? scorePct >= quiz.passMark : null;

    const submission = await prisma.quizSubmission.create({
      data: {
        quizId: quiz.id,
        studentId: student.id,
        answers,
        score: hasOpenEnded ? null : scorePct,
        isPassed,
        attempt: attemptCount + 1,
        status: hasOpenEnded ? 'submitted' : 'graded',
        gradedAt: hasOpenEnded ? null : new Date(),
      },
    });

    // If auto-graded and passed, unlock next week
    if (!hasOpenEnded && isPassed) {
      const week = await prisma.weeklyPlan.findUnique({
        where: { id: quiz.weeklyPlanId },
        select: { weekNumber: true, mentorModuleId: true },
      });
      if (week) {
        await prisma.studentWeekProgress.upsert({
          where: { weeklyPlanId_studentId: { weeklyPlanId: quiz.weeklyPlanId, studentId: student.id } },
          create: { weeklyPlanId: quiz.weeklyPlanId, studentId: student.id, isUnlocked: true, isCompleted: true, completedAt: new Date() },
          update: { isCompleted: true, completedAt: new Date() },
        });
        const nextWeek = await prisma.weeklyPlan.findFirst({
          where: { mentorModuleId: week.mentorModuleId, weekNumber: week.weekNumber + 1 },
        });
        if (nextWeek) {
          await prisma.studentWeekProgress.upsert({
            where: { weeklyPlanId_studentId: { weeklyPlanId: nextWeek.id, studentId: student.id } },
            create: { weeklyPlanId: nextWeek.id, studentId: student.id, isUnlocked: true, unlockedAt: new Date() },
            update: { isUnlocked: true, unlockedAt: new Date() },
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      data: submission,
      message: hasOpenEnded
        ? 'Submitted — your mentor will grade the open-ended questions'
        : isPassed
        ? `Passed with ${scorePct}% — next week unlocked!`
        : `Score: ${scorePct}% — you need ${quiz.passMark}% to pass`,
    });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

// GET /api/curriculum/quizzes/:quizId/my-submission — student sees their latest submission
router.get('/quizzes/:quizId/my-submission', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const student = await getStudentProfile(req.user!.userId);
    if (!student) return res.status(200).json({ success: true, data: null });

    const submission = await prisma.quizSubmission.findFirst({
      where: { quizId: req.params.quizId, studentId: student.id },
      orderBy: { attempt: 'desc' },
    });
    res.json({ success: true, data: submission });
  } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
});

export default router;
