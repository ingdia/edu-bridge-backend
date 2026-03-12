# EDU-Bridge Backend API

> Empowering Public Day School Students with English, Digital Literacy, and Career Guidance

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-blueviolet.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 📖 About

EDU-Bridge is a comprehensive platform designed to support Rwandan students in public day secondary schools, starting with GS Ruyenzi. The platform addresses critical educational gaps by providing:

- **English Communication Skills**: Interactive listening, speaking, reading, and writing exercises
- **Digital Literacy**: Practical computer skills including email simulation and internet safety
- **Career Guidance**: CV/cover letter building, application tracking, and intelligent opportunity matching
- **Mentorship**: Direct student-mentor communication and weekly lab session scheduling
- **Progress Tracking**: Comprehensive analytics for students, mentors, and administrators

## 🎯 Mission

To empower students from public day secondary schools in Rwanda by improving their English communication skills, building practical digital literacy, and providing continuous mentorship that supports their transition to higher education and employment.

## ✨ Features

### For Students
- 📚 Interactive English learning modules (listening, speaking, reading, writing)
- 💻 Digital literacy lessons with email simulation
- 📊 Personal progress dashboard
- 💬 Direct messaging with mentors
- 📝 CV and cover letter builder
- 🎯 Intelligent job/university opportunity matching
- 🔔 Automated notifications and reminders

### For Mentors
- 👥 Student management dashboard
- 📅 Session scheduling and tracking
- ✍️ Exercise evaluation with rubric scoring
- 📈 Student progress monitoring
- 💌 Secure messaging with students
- 🎓 Top performer identification

### For Administrators
- 🏫 Bulk student imports
- 📊 System-wide analytics
- 📄 OCR academic report scanning
- 👨‍💼 Mentor assignment management
- 🔍 Complete audit trail
- 🏥 System health monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for file storage)
- Gmail account (for email notifications)

### Installation

```bash
# Clone repository
git clone https://github.com/ingdia/edu-bridge-backend.git
cd edu-bridge-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/edubridge
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d
NODE_ENV=development
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-app.onrender.com`

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

#### Learning
- `GET /api/modules` - Get all learning modules
- `POST /api/audio/upload` - Upload audio recording
- `POST /api/exercises/submit` - Submit exercise
- `GET /api/progress/:studentId` - Get student progress

#### Mentorship
- `POST /api/sessions/create` - Create mentorship session
- `GET /api/sessions/upcoming` - Get upcoming sessions
- `POST /api/messages` - Send message

#### Career
- `POST /api/career/cv` - Create/update CV
- `GET /api/matching/student/:studentId` - Get matched opportunities
- `POST /api/career/applications` - Create application

#### Admin
- `GET /api/admin/dashboard/overview` - System overview
- `POST /api/bulk/students/import` - Import students
- `POST /api/report-scanning/process` - Scan academic report

For complete API documentation, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary
- **Email**: Nodemailer with Gmail SMTP
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

### Project Structure
```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers (26 controllers)
├── services/        # Business logic (29 services)
├── routes/          # API routes (26 route files)
├── validators/      # Input validation (21 validators)
├── middlewares/     # Custom middleware (RBAC, auth, validation)
├── utils/           # Utility functions
├── templates/       # Email templates
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with Zod
- Rate limiting
- HTTPS/SSL encryption
- Helmet security headers
- CORS configuration
- Complete audit logging
- SQL injection prevention (Prisma)

## 📊 Database Schema

Key models:
- **Users**: Authentication and roles
- **StudentProfile**: Personal, family, socio-economic data
- **MentorProfile**: Expertise and assignments
- **LearningModule**: English and digital literacy content
- **Progress**: Student completion tracking
- **ExerciseSubmission**: Audio, text, and file submissions
- **MentorshipSession**: Scheduling and notes
- **Opportunity**: Jobs, internships, scholarships
- **AuditLog**: Complete action history

See [prisma/schema.prisma](prisma/schema.prisma) for full schema

## 🚀 Deployment

### Quick Deploy to Render

1. Push to GitHub
2. Create account on [render.com](https://render.com)
3. Create PostgreSQL database
4. Create Web Service from GitHub repo
5. Add environment variables
6. Deploy!

For detailed instructions, see:
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Quick start guide
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment guide

## 📈 Monitoring

### Health Endpoints
- `GET /health` - Basic health check
- `GET /api/health` - Detailed health report
- `GET /api/health/database` - Database health
- `GET /api/health/system` - System metrics

### Admin Dashboard
- System overview statistics
- Student performance metrics
- Activity monitoring
- Error tracking

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📝 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate:dev    # Run migrations (dev)
npm run prisma:migrate:deploy # Run migrations (prod)
npm run prisma:studio    # Open Prisma Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details

## 👥 Team

**Diane INGABIRE** - Project Lead & Developer
- GitHub: [@ingdia](https://github.com/ingdia)
- Email: admin@edubridge.rw

## 🙏 Acknowledgments

- African Leadership University
- GS Ruyenzi Secondary School
- All mentors and students participating in the pilot program

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@edubridge.rw
- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for troubleshooting

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core learning modules
- ✅ Mentorship system
- ✅ Career guidance
- ✅ Admin dashboard

### Phase 2 (Future)
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Integration with national education systems
- [ ] Multi-language support
- [ ] Offline-first mobile experience

### Phase 3 (Future)
- [ ] AI-powered tutoring
- [ ] Video lessons
- [ ] Gamification
- [ ] Parent portal
- [ ] Expansion to more schools

---

**EDU-Bridge** - Empowering the next generation of Rwandan leaders through education 🇷🇼
