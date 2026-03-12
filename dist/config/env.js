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
    MAX_FILE_SIZE_MB: zod_1.z.string().default('20').transform((val) => parseInt(val, 10)), // Max file size in MB
    // Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1, 'Cloudinary cloud name is required'),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1, 'Cloudinary API key is required'),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1, 'Cloudinary API secret is required'),
    // Email Configuration (SMTP)
    SMTP_HOST: zod_1.z.string().default('smtp.gmail.com'),
    SMTP_PORT: zod_1.z.string().default('587').transform((val) => parseInt(val, 10)),
    SMTP_USER: zod_1.z.string().email().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().email().default('noreply@edu-bridge.rw'),
    EMAIL_FROM_NAME: zod_1.z.string().default('EDU-Bridge Platform'),
    // Frontend URL (for password reset links)
    FRONTEND_URL: zod_1.z.string().url().default('http://localhost:3000'),
});
// Validate and export
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map