import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import moduleRoutes from './routes/module.routes';
import progressRoutes from './routes/progress.routes';
import academicRoutes from './routes/academic.routes';
import mentorshipRoutes from './routes/mentorship.routes';
import careerRoutes from './routes/career.routes';
import exerciseRoutes from './routes/exercise.routes';
import digitalLiteracyRoutes from './routes/digitalLiteracy.routes';
import notificationRoutes from './routes/notification.routes';
import opportunityRoutes from './routes/opportunity.routes';
import messageRoutes from './routes/message.routes';
import fileRoutes from './routes/file.routes';
import analyticsRoutes from './routes/analytics.routes';
import passwordResetRoutes from './routes/passwordReset.routes';
import profilePhotoRoutes from './routes/profilePhoto.routes';
import audioRoutes from './routes/audio.routes';
import auditLogRoutes from './routes/auditLog.routes';
import adminDashboardRoutes from './routes/adminDashboard.routes';
import sessionSchedulingRoutes from './routes/sessionScheduling.routes';
import academicReportScanningRoutes from './routes/academicReportScanning.routes';
import bulkOperationsRoutes from './routes/bulkOperations.routes';
import opportunityMatchingRoutes from './routes/opportunityMatching.routes';
import emailSimulationRoutes from './routes/emailSimulation.routes';
import schoolRoutes from './routes/school.routes';
import mentorAccessRoutes from './routes/mentorAccess.routes';
import offlineSyncRoutes from './routes/offlineSync.routes';
import healthRoutes from './routes/health.routes';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter.middleware';

const app: Application = express();

// ─────────────────────────────────────────────────────────────
// SECURITY MIDDLEWARE (SRS NFR 1: Security)
// ─────────────────────────────────────────────────────────────

// 1. Helmet: Sets secure HTTP headers (XSS protection, no sniffing, etc.)
app.use(helmet());

// 2. CORS: Configure allowed origins (Restrict to frontend domain in production)
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? 'https://edu-bridge.rw' : '*', // Allow all in dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─────────────────────────────────────────────────────────────
// BODY PARSING & LOGGING (SRS NFR 5: Auditability)
// ─────────────────────────────────────────────────────────────

// 3. Morgan: HTTP Request Logger (Audit Trail)
// Format: 'combined' includes IP, user agent, timestamp, status
app.use(morgan('combined'));

// 4. JSON Parser: Limit payload size to prevent DoS (SRS NFR 2: Performance)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Rate Limiting: Protect against brute force and DoS attacks
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// ─────────────────────────────────────────────────────────────
// ROUTES (Placeholder for Future Steps)
// ─────────────────────────────────────────────────────────────

// Health Check Endpoint (SRS NFR 2: Performance Monitoring)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'EDU-Bridge API',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// Detailed Health Monitoring
app.use('/api/health', healthRoutes);

// API Versioning Root (SRS 3.3: Software Interfaces)
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to EDU-Bridge API',
    version: '1.0.0',
    documentation: '/api/docs', // Future Swagger endpoint
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api', moduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/digital-literacy', digitalLiteracyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/profile-photo', profilePhotoRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/sessions', sessionSchedulingRoutes);
app.use('/api/report-scanning', academicReportScanningRoutes);
app.use('/api/bulk', bulkOperationsRoutes);
app.use('/api/matching', opportunityMatchingRoutes);
app.use('/api/email-simulation', emailSimulationRoutes);
app.use('/api/offline-sync', offlineSyncRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/mentor-access', mentorAccessRoutes);
// ─────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER (SRS NFR 1: Security & Stability)
// ─────────────────────────────────────────────────────────────

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error for audit (NFR 5)
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  console.error(err.stack);

  // Send generic message to client (hide stack trace in production)
  res.status(err instanceof Error ? 500 : 400).json({
    success: false,
    message: env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────

export default app;