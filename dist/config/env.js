"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// src/config/env.ts
const zod_1 = require("zod");
// Define the expected shape of environment variables
const envSchema = zod_1.z.object({
    // Database
    DATABASE_URL: zod_1.z.string().url(),
    // Server
    PORT: zod_1.z.string().transform((val) => parseInt(val, 10)),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // Security (JWT)
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'), // e.g., '1h', '7d'
    // File Upload (for academic reports, CVs)
    MAX_FILE_SIZE: zod_1.z.string().default('5242880').transform((val) => parseInt(val, 10)), // 5MB in bytes
});
// Validate and export
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map