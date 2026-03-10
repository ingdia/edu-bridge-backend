// src/routes/module.routes.ts
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { listModules } from '../controllers/module.controller';
// ✅ SINGLE SOURCE: Import Role from Prisma via jwt utils (or directly)
import { Role } from '@prisma/client';

const router = Router();

router.get(
  '/modules',
  authenticate,
  // ✅ Pass enum VALUES (not strings) — matches your middleware's rest params
  authorize(Role.STUDENT, Role.MENTOR, Role.ADMIN),
  listModules
);

export default router;