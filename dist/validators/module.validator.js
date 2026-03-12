"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listModulesQuerySchema = exports.updateModuleSchema = exports.createModuleSchema = exports.moduleParamsSchema = void 0;
// src/validators/module.validator.ts
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// ─────────────────────────────────────────────────────────────
// PATH PARAMETERS
// ─────────────────────────────────────────────────────────────
exports.moduleParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid module ID format'),
});
// ─────────────────────────────────────────────────────────────
// CREATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
exports.createModuleSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10).max(2000).optional(),
    type: zod_1.z.nativeEnum(client_1.ExerciseType),
    contentUrl: zod_1.z.string().url('Must be a valid URL'),
    difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedDuration: zod_1.z.number().int().positive().min(1).max(300).optional(), // in minutes
    orderIndex: zod_1.z.number().int().min(0).default(0),
    isActive: zod_1.z.boolean().default(true),
});
// ─────────────────────────────────────────────────────────────
// UPDATE MODULE (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
exports.updateModuleSchema = exports.createModuleSchema.partial();
// ─────────────────────────────────────────────────────────────
// LIST MODULES QUERY (All roles)
// ─────────────────────────────────────────────────────────────
exports.listModulesQuerySchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(client_1.ExerciseType).optional(),
    difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    search: zod_1.z.string().max(100).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    sortBy: zod_1.z.enum(['title', 'difficulty', 'orderIndex', 'createdAt']).default('orderIndex'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc'),
});
//# sourceMappingURL=module.validator.js.map