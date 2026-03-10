// src/server.ts
import 'dotenv/config';
import app from './app';
import prisma from './config/database';
import { env } from './config/env';

async function startServer() {
  try {
    // Connect to Database
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start HTTP Server
    app.listen(env.PORT, () => {
      console.log(`🚀 EDU-Bridge Server running on port ${env.PORT}`);
      console.log(`📦 Environment: ${env.NODE_ENV}`);
      console.log(`🔒 Security: Helmet & CORS enabled`);
      console.log(`📝 Logging: Morgan enabled`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful Shutdown (SRS NFR 9: Reliability)

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();