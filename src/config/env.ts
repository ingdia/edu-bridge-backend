// src/config/env.ts
import { z } from 'zod';

// Define the expected shape of environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Server
  PORT: z.string().transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Security (JWT)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'), // e.g., '1h', '7d'
  
  // File Upload (for academic reports, CVs)
  MAX_FILE_SIZE: z.string().default('5242880').transform((val) => parseInt(val, 10)), // 5MB in bytes
  MAX_FILE_SIZE_MB: z.string().default('20').transform((val) => parseInt(val, 10)), // Max file size in MB
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary cloud name is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API key is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'Cloudinary API secret is required'),
  
  // Email Configuration (SMTP)
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587').transform((val) => parseInt(val, 10)),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().default('noreply@edu-bridge.rw'),
  EMAIL_FROM_NAME: z.string().default('EDU-Bridge Platform'),
  
  // Frontend URL (for password reset links)
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
});

// Validate and export
export const env = envSchema.parse(process.env);

// Type inference for reuse
export type Env = z.infer<typeof envSchema>;