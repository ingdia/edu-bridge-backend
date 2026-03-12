// Swagger configuration disabled - install swagger-jsdoc if needed
// import swaggerJsdoc from 'swagger-jsdoc';

/*
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EDU-Bridge API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for EDU-Bridge Platform - Empowering Public Day School Students with English, Digital Literacy, and Career Guidance',
      contact: {
        name: 'EDU-Bridge Team',
        email: 'support@edubridge.rw'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.edubridge.rw',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['STUDENT', 'MENTOR', 'ADMIN'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        StudentProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            fullName: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            nationalId: { type: 'string' },
            schoolName: { type: 'string' },
            gradeLevel: { type: 'string' },
            guardianName: { type: 'string' },
            guardianContact: { type: 'string' },
            homeAddress: { type: 'string' },
            district: { type: 'string' },
            province: { type: 'string' }
          }
        },
        LearningModule: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['LISTENING', 'SPEAKING', 'READING', 'WRITING', 'DIGITAL_LITERACY'] },
            contentUrl: { type: 'string' },
            difficulty: { type: 'string' },
            estimatedDuration: { type: 'integer' }
          }
        },
        Progress: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            moduleId: { type: 'string', format: 'uuid' },
            score: { type: 'integer', minimum: 0, maximum: 100 },
            feedback: { type: 'string' },
            completedAt: { type: 'string', format: 'date-time' }
          }
        },
        MentorshipSession: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            mentorId: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            scheduledFor: { type: 'string', format: 'date-time' },
            duration: { type: 'integer' },
            location: { type: 'string' },
            status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] },
            notes: { type: 'string' }
          }
        },
        Opportunity: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            organization: { type: 'string' },
            type: { type: 'string', enum: ['JOB', 'INTERNSHIP', 'SCHOLARSHIP', 'UNIVERSITY', 'TRAINING'] },
            description: { type: 'string' },
            minGrade: { type: 'string' },
            requiredSkills: { type: 'array', items: { type: 'string' } },
            deadline: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Profile', description: 'Student profile management' },
      { name: 'Modules', description: 'Learning modules' },
      { name: 'Audio', description: 'Audio recording and playback' },
      { name: 'Exercises', description: 'Exercise submissions' },
      { name: 'Progress', description: 'Progress tracking' },
      { name: 'Digital Literacy', description: 'Digital literacy lessons' },
      { name: 'Email Simulation', description: 'Interactive email practice' },
      { name: 'Academic Reports', description: 'Academic report management' },
      { name: 'Report Scanning', description: 'OCR report scanning' },
      { name: 'Mentorship', description: 'Mentorship sessions' },
      { name: 'Session Scheduling', description: 'Lab session scheduling' },
      { name: 'Messages', description: 'Student-mentor messaging' },
      { name: 'Career', description: 'CV and application tracking' },
      { name: 'Opportunities', description: 'Job and university opportunities' },
      { name: 'Opportunity Matching', description: 'Intelligent opportunity matching' },
      { name: 'Notifications', description: 'Notification management' },
      { name: 'Bulk Operations', description: 'Admin bulk operations' },
      { name: 'Offline Sync', description: 'Offline data synchronization' },
      { name: 'Admin Dashboard', description: 'Admin dashboard and analytics' },
      { name: 'Audit Logs', description: 'System audit logs' },
      { name: 'Analytics', description: 'Analytics and reporting' }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};
*/

export const swaggerSpec = {}; // swaggerJsdoc(options);
