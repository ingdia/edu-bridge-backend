"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/module.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const client_1 = require("@prisma/client");
const module_controller_1 = require("../controllers/module.controller");
const router = (0, express_1.Router)();
// ─────────────────────────────────────────────────────────────
// PUBLIC/GENERAL ENDPOINTS (All authenticated users)
// ─────────────────────────────────────────────────────────────
// GET /api/modules - List modules with filters (RBAC applied in service)
router.get('/modules', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.STUDENT, client_1.Role.MENTOR, client_1.Role.ADMIN), module_controller_1.listModulesHandler);
// GET /api/modules/:id - Get single module details (RBAC applied in service)
router.get('/modules/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.STUDENT, client_1.Role.MENTOR, client_1.Role.ADMIN), module_controller_1.getModuleHandler);
// ─────────────────────────────────────────────────────────────
// ADMIN-ONLY ENDPOINTS (Module Management)
// ─────────────────────────────────────────────────────────────
// POST /api/modules - Create new learning module
router.post('/modules', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.ADMIN), module_controller_1.createModuleHandler);
// PUT /api/modules/:id - Update module details
router.put('/modules/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.ADMIN), module_controller_1.updateModuleHandler);
// DELETE /api/modules/:id - Soft delete (deactivate) module
router.delete('/modules/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.ADMIN), module_controller_1.deleteModuleHandler);
// PATCH /api/modules/:id/status - Toggle active/inactive status
router.patch('/modules/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.ADMIN), module_controller_1.toggleModuleStatusHandler);
// ─────────────────────────────────────────────────────────────
// ROLE-SPECIFIC ENDPOINTS
// ─────────────────────────────────────────────────────────────
// GET /api/modules/mentor - Modules for mentor's assigned students
router.get('/modules/mentor', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.MENTOR), module_controller_1.getModulesForMentorHandler);
// GET /api/modules/student - Modules available for current student
router.get('/modules/student', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Role.STUDENT), module_controller_1.getModulesForStudentHandler);
exports.default = router;
//# sourceMappingURL=module.routes.js.map