"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const module_routes_1 = __importDefault(require("./routes/module.routes"));
const progress_routes_1 = __importDefault(require("./routes/progress.routes"));
const academic_routes_1 = __importDefault(require("./routes/academic.routes"));
const mentorship_routes_1 = __importDefault(require("./routes/mentorship.routes"));
const career_routes_1 = __importDefault(require("./routes/career.routes"));
const exercise_routes_1 = __importDefault(require("./routes/exercise.routes"));
const digitalLiteracy_routes_1 = __importDefault(require("./routes/digitalLiteracy.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const opportunity_routes_1 = __importDefault(require("./routes/opportunity.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const file_routes_1 = __importDefault(require("./routes/file.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const passwordReset_routes_1 = __importDefault(require("./routes/passwordReset.routes"));
const profilePhoto_routes_1 = __importDefault(require("./routes/profilePhoto.routes"));
const audio_routes_1 = __importDefault(require("./routes/audio.routes"));
const auditLog_routes_1 = __importDefault(require("./routes/auditLog.routes"));
const adminDashboard_routes_1 = __importDefault(require("./routes/adminDashboard.routes"));
const sessionScheduling_routes_1 = __importDefault(require("./routes/sessionScheduling.routes"));
const academicReportScanning_routes_1 = __importDefault(require("./routes/academicReportScanning.routes"));
const bulkOperations_routes_1 = __importDefault(require("./routes/bulkOperations.routes"));
const opportunityMatching_routes_1 = __importDefault(require("./routes/opportunityMatching.routes"));
const emailSimulation_routes_1 = __importDefault(require("./routes/emailSimulation.routes"));
const offlineSync_routes_1 = __importDefault(require("./routes/offlineSync.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const app = (0, express_1.default)();
// ─────────────────────────────────────────────────────────────
// SECURITY MIDDLEWARE (SRS NFR 1: Security)
// ─────────────────────────────────────────────────────────────
// 1. Helmet: Sets secure HTTP headers (XSS protection, no sniffing, etc.)
app.use((0, helmet_1.default)());
// 2. CORS: Configure allowed origins (Restrict to frontend domain in production)
app.use((0, cors_1.default)({
    origin: env_1.env.NODE_ENV === 'production' ? 'https://edu-bridge.rw' : '*', // Allow all in dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// ─────────────────────────────────────────────────────────────
// BODY PARSING & LOGGING (SRS NFR 5: Auditability)
// ─────────────────────────────────────────────────────────────
// 3. Morgan: HTTP Request Logger (Audit Trail)
// Format: 'combined' includes IP, user agent, timestamp, status
app.use((0, morgan_1.default)('combined'));
// 4. JSON Parser: Limit payload size to prevent DoS (SRS NFR 2: Performance)
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 5. Rate Limiting: Protect against brute force and DoS attacks
app.use('/api/', rateLimiter_middleware_1.apiLimiter);
app.use('/api/auth', rateLimiter_middleware_1.authLimiter);
// ─────────────────────────────────────────────────────────────
// ROUTES (Placeholder for Future Steps)
// ─────────────────────────────────────────────────────────────
// Health Check Endpoint (SRS NFR 2: Performance Monitoring)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'EDU-Bridge API',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
        uptime: process.uptime(),
    });
});
// Detailed Health Monitoring
app.use('/api/health', health_routes_1.default);
// API Versioning Root (SRS 3.3: Software Interfaces)
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to EDU-Bridge API',
        version: '1.0.0',
        documentation: '/api/docs', // Future Swagger endpoint
    });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api', module_routes_1.default);
app.use('/api/progress', progress_routes_1.default);
app.use('/api/academic', academic_routes_1.default);
app.use('/api/mentorship', mentorship_routes_1.default);
app.use('/api/career', career_routes_1.default);
app.use('/api/exercises', exercise_routes_1.default);
app.use('/api/digital-literacy', digitalLiteracy_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/opportunities', opportunity_routes_1.default);
app.use('/api/messages', message_routes_1.default);
app.use('/api/files', file_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/password-reset', passwordReset_routes_1.default);
app.use('/api/profile-photo', profilePhoto_routes_1.default);
app.use('/api/audio', audio_routes_1.default);
app.use('/api/audit-logs', auditLog_routes_1.default);
app.use('/api/admin/dashboard', adminDashboard_routes_1.default);
app.use('/api/sessions', sessionScheduling_routes_1.default);
app.use('/api/report-scanning', academicReportScanning_routes_1.default);
app.use('/api/bulk', bulkOperations_routes_1.default);
app.use('/api/matching', opportunityMatching_routes_1.default);
app.use('/api/email-simulation', emailSimulation_routes_1.default);
app.use('/api/offline-sync', offlineSync_routes_1.default);
// ─────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER (SRS NFR 1: Security & Stability)
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    // Log error for audit (NFR 5)
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
    console.error(err.stack);
    // Send generic message to client (hide stack trace in production)
    res.status(err instanceof Error ? 500 : 400).json({
        success: false,
        message: env_1.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        ...(env_1.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────
exports.default = app;
//# sourceMappingURL=app.js.map