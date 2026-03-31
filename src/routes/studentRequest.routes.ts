import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import prisma from '../config/database';

const router = Router();

// ─── STUDENT: request access to a mentor ──────────────────────
// POST /api/student-requests — student submits a request to a mentor at their school
router.post('/', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { mentorId, note } = req.body;

    if (!mentorId) return res.status(400).json({ success: false, message: 'mentorId is required' });

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true, schoolId: true, schoolName: true },
    });
    if (!studentProfile) return res.status(404).json({ success: false, message: 'Student profile not found' });

    // Verify mentor is on the same school
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { id: mentorId },
      select: { id: true, schoolId: true, school: { select: { name: true } }, accessStatus: true },
    });
    if (!mentorProfile) return res.status(404).json({ success: false, message: 'Mentor not found' });
    if (mentorProfile.accessStatus !== 'APPROVED') {
      return res.status(400).json({ success: false, message: 'This mentor is not yet approved' });
    }

    // Check same school — by schoolId or schoolName
    const sameSchool =
      (studentProfile.schoolId && mentorProfile.schoolId && studentProfile.schoolId === mentorProfile.schoolId) ||
      (mentorProfile.school?.name && studentProfile.schoolName === mentorProfile.school.name);

    if (!sameSchool) {
      return res.status(403).json({ success: false, message: 'You can only request mentors from your school' });
    }

    // Upsert request (re-request if previously rejected)
    const request = await prisma.studentMentorRequest.upsert({
      where: { studentId_mentorId: { studentId: studentProfile.id, mentorId } },
      create: { studentId: studentProfile.id, mentorId, note: note || null, status: 'PENDING' },
      update: { status: 'PENDING', note: note || null, rejectNote: null },
    });

    res.status(201).json({ success: true, message: 'Request sent to mentor', data: request });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/student-requests/my — student sees their own requests
router.get('/my', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!studentProfile) return res.status(200).json({ success: true, data: [] });

    const requests = await prisma.studentMentorRequest.findMany({
      where: { studentId: studentProfile.id },
      include: {
        mentor: {
          select: {
            id: true,
            expertise: true,
            school: { select: { name: true } },
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: requests });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/student-requests/mentors — student gets approved mentors at their school to choose from
router.get('/mentors', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true, schoolId: true, schoolName: true },
    });
    if (!studentProfile) return res.status(200).json({ success: true, data: [] });

    const mentors = await prisma.mentorProfile.findMany({
      where: {
        accessStatus: 'APPROVED',
        OR: [
          ...(studentProfile.schoolId ? [{ schoolId: studentProfile.schoolId }] : []),
          { school: { name: studentProfile.schoolName } },
        ],
      },
      select: {
        id: true,
        expertise: true,
        bio: true,
        school: { select: { name: true } },
        user: { select: { email: true } },
      },
    });

    res.json({ success: true, data: mentors });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ─── MENTOR: manage student requests ──────────────────────────
// GET /api/student-requests/pending — mentor sees pending requests
router.get('/pending', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!mentorProfile) return res.status(200).json({ success: true, data: [] });

    const requests = await prisma.studentMentorRequest.findMany({
      where: { mentorId: mentorProfile.id },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            gradeLevel: true,
            schoolName: true,
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: requests });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PATCH /api/student-requests/:id/approve — mentor approves a student
router.patch('/:id/approve', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!mentorProfile) return res.status(404).json({ success: false, message: 'Mentor profile not found' });

    const request = await prisma.studentMentorRequest.findFirst({
      where: { id: req.params.id, mentorId: mentorProfile.id },
      include: { student: { select: { userId: true } } },
    });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    // Approve the request
    await prisma.studentMentorRequest.update({
      where: { id: req.params.id },
      data: { status: 'APPROVED' },
    });

    // Activate the student account and update their profile
    await prisma.studentProfile.update({
      where: { id: request.studentId },
      data: { accessStatus: 'APPROVED', assignedMentorId: mentorProfile.id },
    });
    await prisma.user.update({
      where: { id: request.student.userId },
      data: { isActive: true },
    });

    res.json({ success: true, message: 'Student approved — they can now log in' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PATCH /api/student-requests/:id/reject — mentor rejects a student
router.patch('/:id/reject', authenticate, authorize('MENTOR'), async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { reason } = req.body;
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!mentorProfile) return res.status(404).json({ success: false, message: 'Mentor profile not found' });

    const request = await prisma.studentMentorRequest.findFirst({
      where: { id: req.params.id, mentorId: mentorProfile.id },
      include: { student: { select: { userId: true } } },
    });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    await prisma.studentMentorRequest.update({
      where: { id: req.params.id },
      data: { status: 'REJECTED', rejectNote: reason || 'Request declined by mentor' },
    });

    await prisma.studentProfile.update({
      where: { id: request.studentId },
      data: { accessStatus: 'REJECTED', accessNote: reason || 'Request declined by mentor' },
    });

    res.json({ success: true, message: 'Student request rejected' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
