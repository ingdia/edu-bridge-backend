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
  MAX_FILE_SIZE: z.string().transform((val) => parseInt(val, 10)).default('5242880'), // 5MB in bytes
});

// Validate and export
export const env = envSchema.parse(process.env);

// Type inference for reuse
export type Env = z.infer<typeof envSchema>;