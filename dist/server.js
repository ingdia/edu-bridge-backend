"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const env_1 = require("./config/env");
const sessionReminder_job_1 = require("./jobs/sessionReminder.job");
async function startServer() {
    try {
        // Connect to Database
        await database_1.default.$connect();
        console.log('✅ Database connected successfully');
        // Start Cron Jobs
        (0, sessionReminder_job_1.startAllCronJobs)();
        console.log('✅ Cron jobs started successfully');
        // Start HTTP Server
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`🚀 EDU-Bridge Server running on port ${env_1.env.PORT}`);
            console.log(`📦 Environment: ${env_1.env.NODE_ENV}`);
            console.log(`🔒 Security: Helmet & CORS enabled`);
            console.log(`📝 Logging: Morgan enabled`);
            console.log(`⏰ Cron Jobs: Session reminders & deadline alerts active`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        await database_1.default.$disconnect();
        process.exit(1);
    }
}
// Graceful Shutdown (SRS NFR 9: Reliability)
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await database_1.default.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM received. Shutting down...');
    await database_1.default.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=server.js.map