// src/config/database.ts
import { PrismaClient } from '@prisma/client';

// Create a single Prisma Client instance (singleton pattern)
const prisma = new PrismaClient({
  // Log queries in development for debugging (SRS NFR 5: Auditability)
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Export the instance for use across services/controllers
export default prisma;
