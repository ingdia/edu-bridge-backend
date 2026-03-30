import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import prisma from '../config/database';
import { notificationService } from '../services/notification.service';

const router = Router();

// GET /api/mentor-access — admin gets all mentor access requests
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && status !== 'ALL') where.accessStatus = status;

    const mentors = await prisma.mentorProfile.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, isActive: true, createdAt: true } },
        school: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: mentors });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PATCH /api/mentor-access/:id/approve — admin approves and optionally assigns school
router.patch('/:id/approve', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { schoolId } = req.body;
    const mentor = await prisma.mentorProfile.update({
      where: { id: req.params.id },
      data: {
        accessStatus: 'APPROVED',
        accessNote: null,
        ...(schoolId ? { schoolId } : {}),
      },
      include: { user: { select: { id: true, email: true } } },
    });

    await prisma.user.update({
      where: { id: mentor.userId },
      data: { isActive: true },
    });

    // Backfill schoolId on existing students if school was assigned during approval
    if (schoolId) {
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
        select: { name: true },
      });
      if (school) {
        await prisma.studentProfile.updateMany({
          where: { schoolName: school.name, schoolId: null },
          data: { schoolId },
        });
      }
    }

    res.json({ success: true, message: 'Mentor approved', data: mentor });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PATCH /api/mentor-access/:id/assign-school — admin assigns mentor to a school
router.patch('/:id/assign-school', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { schoolId } = req.body;
    if (!schoolId) return res.status(400).json({ success: false, message: 'schoolId is required' });

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { name: true },
    });
    if (!school) return res.status(404).json({ success: false, message: 'School not found' });

    const mentor = await prisma.mentorProfile.update({
      where: { id: req.params.id },
      data: { schoolId },
      include: {
        user: { select: { id: true, email: true } },
        school: { select: { id: true, name: true } },
      },
    });

    // Backfill schoolId on existing students who match by schoolName
    await prisma.studentProfile.updateMany({
      where: { schoolName: school.name, schoolId: null },
      data: { schoolId },
    });

    res.json({ success: true, message: 'School assigned to mentor', data: mentor });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/mentor-access/:id/modules — get modules assigned to a mentor
router.get('/:id/modules', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const assignments = await prisma.mentorModule.findMany({
      where: { mentorId: req.params.id },
      include: { module: { select: { id: true, title: true, type: true, difficulty: true, isActive: true } } },
    });
    res.json({ success: true, data: assignments.map((a) => a.module) });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// POST /api/mentor-access/:id/modules — assign a module to a mentor
router.post('/:id/modules', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { moduleId } = req.body;
    if (!moduleId) return res.status(400).json({ success: false, message: 'moduleId is required' });

    await prisma.mentorModule.upsert({
      where: { mentorId_moduleId: { mentorId: req.params.id, moduleId } },
      create: { mentorId: req.params.id, moduleId },
      update: {},
    });

    res.json({ success: true, message: 'Module assigned to mentor' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// DELETE /api/mentor-access/:id/modules/:moduleId — unassign a module from a mentor
router.delete('/:id/modules/:moduleId', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.mentorModule.deleteMany({
      where: { mentorId: req.params.id, moduleId: req.params.moduleId },
    });
    res.json({ success: true, message: 'Module unassigned from mentor' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PATCH /api/mentor-access/:mentorProfileId/reject — admin rejects
router.patch('/:id/reject', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { reason } = req.body;
    const mentor = await prisma.mentorProfile.update({
      where: { id: req.params.id },
      data: { accessStatus: 'REJECTED', accessNote: reason || 'Access denied by administrator' },
      include: { user: { select: { id: true, email: true } } },
    });

    // Deactivate the user account
    await prisma.user.update({
      where: { id: mentor.userId },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Mentor rejected', data: mentor });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
