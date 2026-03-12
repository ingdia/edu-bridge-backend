"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/database.ts
const client_1 = require("@prisma/client");
// Create a single Prisma Client instance (singleton pattern)
const prisma = new client_1.PrismaClient({
    // Log queries in development for debugging (SRS NFR 5: Auditability)
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
// Export the instance for use across services/controllers
exports.default = prisma;
//# sourceMappingURL=database.js.map