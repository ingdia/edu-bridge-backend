// src/routes/module.routes.ts
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';
import {
  createModuleHandler,
  getModuleHandler,
  listModulesHandler,
  updateModuleHandler,
  deleteModuleHandler,
  toggleModuleStatusHandler,
  getModulesForMentorHandler,
  getModulesForStudentHandler,
} from '../controllers/module.controller';

const router = Router();

// ─────────────────────────────────────────────────────────────
// PUBLIC/GENERAL ENDPOINTS (All authenticated users)
// ─────────────────────────────────────────────────────────────

// GET /api/modules - List modules with filters (RBAC applied in service)
router.get(
  '/modules',
  authenticate,
  authorize(Role.STUDENT, Role.MENTOR, Role.ADMIN),
  listModulesHandler
);

// ─────────────────────────────────────────────────────────────
// ROLE-SPECIFIC ENDPOINTS — must be before /modules/:id
// ─────────────────────────────────────────────────────────────

// GET /api/modules/student - Modules available for current student
router.get(
  '/modules/student',
  authenticate,
  authorize(Role.STUDENT),
  getModulesForStudentHandler
);

// GET /api/modules/mentor - Modules for mentor's assigned students
router.get(
  '/modules/mentor',
  authenticate,
  authorize(Role.MENTOR),
  getModulesForMentorHandler
);

// GET /api/modules/:id - Get single module details (RBAC applied in service)
router.get(
  '/modules/:id',
  authenticate,
  authorize(Role.STUDENT, Role.MENTOR, Role.ADMIN),
  getModuleHandler
);

// ─────────────────────────────────────────────────────────────
// ADMIN-ONLY ENDPOINTS (Module Management)
// ─────────────────────────────────────────────────────────────

// POST /api/modules - Create new learning module
router.post(
  '/modules',
  authenticate,
  authorize(Role.ADMIN),
  createModuleHandler
);

// PUT /api/modules/:id - Update module details
router.put(
  '/modules/:id',
  authenticate,
  authorize(Role.ADMIN),
  updateModuleHandler
);

// DELETE /api/modules/:id - Soft delete (deactivate) module
router.delete(
  '/modules/:id',
  authenticate,
  authorize(Role.ADMIN),
  deleteModuleHandler
);

// PATCH /api/modules/:id/status - Toggle active/inactive status
router.patch(
  '/modules/:id/status',
  authenticate,
  authorize(Role.ADMIN),
  toggleModuleStatusHandler
);

export default router;