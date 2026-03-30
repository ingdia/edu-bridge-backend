import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import prisma from '../config/database';

const router = Router();

// GET /api/schools — public list for registration dropdowns
router.get('/', async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, district: true, province: true },
    });
    res.json({ success: true, data: schools });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// POST /api/schools — admin creates a school
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, district, province } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'School name is required' });
    const school = await prisma.school.create({ data: { name, district, province } });
    res.status(201).json({ success: true, data: school });
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ success: false, message: 'School already exists' });
    res.status(500).json({ success: false, message: e.message });
  }
});

// PATCH /api/schools/:id — admin updates a school
router.patch('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: school });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// DELETE /api/schools/:id — admin deactivates a school
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.school.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'School deactivated' });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
