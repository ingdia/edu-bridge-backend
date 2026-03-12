# EDU-Bridge Frontend Integration Guide

> Complete API documentation and integration requirements for frontend developers

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [User Roles & Permissions](#user-roles--permissions)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [File Upload Requirements](#file-upload-requirements)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## 🎯 Overview

**Base URL**: 
- Development: `http://localhost:5000`
- Production: `https://your-app.onrender.com`

**API Version**: v1  
**Content-Type**: `application/json`  
**Authentication**: JWT Bearer Token

---

## 🔐 Authentication Flow

### 1. Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

**Response (201)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Response (200)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

**Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

### 🔑 Token Storage
- Store `accessToken` in memory or secure storage (expires in 7 days)
- Store `refreshToken` in httpOnly cookie or secure storage (expires in 30 days)
- Include `Authorization: Bearer <accessToken>` header in all protected requests
- Refresh token when you receive 401 Unauthorized

---

## 👥 User Roles & Permissions

### Roles
- `STUDENT` - Can access learning modules, submit exercises, message mentors
- `MENTOR` - Can evaluate submissions, schedule sessions, message students
- `ADMIN` - Full system access, user management, analytics

### Role-Based Access
Each endpoint specifies required roles. Frontend should:
- Hide/disable features based on user role
- Redirect unauthorized users appropriately
- Show role-specific navigation menus

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | No | - | Register new user |
| POST | `/api/auth/login` | No | - | User login |
| POST | `/api/auth/logout` | Yes | All | User logout |
| POST | `/api/auth/refresh` | No | - | Refresh access token |
| POST | `/api/auth/forgot-password` | No | - | Request password reset |
| POST | `/api/auth/reset-password` | No | - | Reset password with token |

---

### Student Profile Endpoints

#### Get Student Profile
```http
GET /api/students/profile/:studentId
Authorization: Bearer <accessToken>
```

**Response (200)**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "dateOfBirth": "2005-03-15",
  "gender": "MALE",
  "phoneNumber": "+250788123456",
  "address": "Kigali, Rwanda",
  "schoolName": "GS Ruyenzi",
  "gradeLevel": "S4",
  "stream": "MCB",
  "guardianName": "Jane Doe",
  "guardianPhone": "+250788654321",
  "guardianRelationship": "Mother",
  "hasComputer": false,
  "hasInternet": true,
  "internetAccess": "MOBILE_DATA",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "student@example.com"
  }
}
```

#### Update Student Profile
```http
PUT /api/students/profile/:studentId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "phoneNumber": "+250788123456",
  "address": "Kigali, Rwanda",
  "hasComputer": true,
  "hasInternet": true
}
```

---

### Learning Module Endpoints

#### Get All Modules
```http
GET /api/modules
Authorization: Bearer <accessToken>
```

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "title": "English Listening Skills",
    "description": "Improve your listening comprehension",
    "category": "ENGLISH",
    "skillType": "LISTENING",
    "difficultyLevel": "BEGINNER",
    "estimatedDuration": 30,
    "orderIndex": 1,
    "isActive": true,
    "exercises": [
      {
        "id": "uuid",
        "title": "Listen and Repeat",
        "type": "AUDIO_RECORDING",
        "instructions": "Listen to the audio and repeat",
        "maxScore": 10
      }
    ]
  }
]
```

#### Get Module by ID
```http
GET /api/modules/:moduleId
Authorization: Bearer <accessToken>
```

#### Get Student Progress
```http
GET /api/progress/:studentId
Authorization: Bearer <accessToken>
```

**Response (200)**:
```json
{
  "studentId": "uuid",
  "totalModules": 20,
  "completedModules": 5,
  "inProgressModules": 3,
  "overallProgress": 25,
  "moduleProgress": [
    {
      "moduleId": "uuid",
      "moduleTitle": "English Listening Skills",
      "status": "COMPLETED",
      "progress": 100,
      "score": 85,
      "completedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Exercise Submission Endpoints

#### Submit Exercise
```http
POST /api/exercises/submit
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "exerciseId": "uuid",
  "studentId": "uuid",
  "submissionType": "TEXT",
  "textAnswer": "My answer here",
  "audioUrl": null,
  "fileUrl": null
}
```

**Submission Types**:
- `TEXT` - Text-based answer (textAnswer required)
- `AUDIO_RECORDING` - Audio file (audioUrl required)
- `FILE_UPLOAD` - Document/file (fileUrl required)
- `MULTIPLE_CHOICE` - Selected option (textAnswer with option ID)

**Response (201)**:
```json
{
  "id": "uuid",
  "exerciseId": "uuid",
  "studentId": "uuid",
  "submissionType": "TEXT",
  "textAnswer": "My answer here",
  "status": "PENDING",
  "submittedAt": "2024-01-15T10:30:00Z"
}
```

#### Get Student Submissions
```http
GET /api/exercises/submissions/:studentId
Authorization: Bearer <accessToken>
```

---

### Audio Upload Endpoint

#### Upload Audio Recording
```http
POST /api/audio/upload
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

{
  "audio": <File>,
  "studentId": "uuid",
  "exerciseId": "uuid"
}
```

**Response (200)**:
```json
{
  "url": "https://res.cloudinary.com/your-cloud/audio/recording.mp3",
  "publicId": "audio/uuid",
  "duration": 45
}
```

**Requirements**:
- Max file size: 10MB
- Accepted formats: mp3, wav, m4a, ogg
- Use FormData for upload

---

### Mentorship Session Endpoints

#### Create Session
```http
POST /api/sessions/create
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "mentorId": "uuid",
  "studentId": "uuid",
  "scheduledDate": "2024-01-20T14:00:00Z",
  "duration": 60,
  "sessionType": "ONE_ON_ONE",
  "topic": "Career guidance discussion"
}
```

**Session Types**:
- `ONE_ON_ONE` - Individual session
- `GROUP` - Group session
- `LAB` - Lab session

**Response (201)**:
```json
{
  "id": "uuid",
  "mentorId": "uuid",
  "studentId": "uuid",
  "scheduledDate": "2024-01-20T14:00:00Z",
  "duration": 60,
  "sessionType": "ONE_ON_ONE",
  "status": "SCHEDULED",
  "topic": "Career guidance discussion"
}
```

#### Get Upcoming Sessions
```http
GET /api/sessions/upcoming?userId=uuid&role=STUDENT
Authorization: Bearer <accessToken>
```

#### Update Session Status
```http
PATCH /api/sessions/:sessionId/status
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "COMPLETED",
  "notes": "Great progress on CV building"
}
```

**Session Statuses**:
- `SCHEDULED` - Upcoming session
- `COMPLETED` - Session finished
- `CANCELLED` - Session cancelled
- `NO_SHOW` - Student didn't attend

---

### Messaging Endpoints

#### Send Message
```http
POST /api/messages
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "senderId": "uuid",
  "receiverId": "uuid",
  "content": "Hello, I need help with my CV",
  "attachmentUrl": null
}
```

#### Get Conversation
```http
GET /api/messages/conversation?user1Id=uuid&user2Id=uuid
Authorization: Bearer <accessToken>
```

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "senderId": "uuid",
    "receiverId": "uuid",
    "content": "Hello, I need help with my CV",
    "isRead": false,
    "sentAt": "2024-01-15T10:30:00Z",
    "sender": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

#### Mark as Read
```http
PATCH /api/messages/:messageId/read
Authorization: Bearer <accessToken>
```

---

### Career Guidance Endpoints

#### Create/Update CV
```http
POST /api/career/cv
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "studentId": "uuid",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+250788123456"
  },
  "education": [
    {
      "institution": "GS Ruyenzi",
      "degree": "O-Level",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31"
    }
  ],
  "skills": ["Communication", "Microsoft Office"],
  "languages": ["English", "Kinyarwanda", "French"]
}
```

#### Get Student CV
```http
GET /api/career/cv/:studentId
Authorization: Bearer <accessToken>
```

#### Get Matched Opportunities
```http
GET /api/matching/student/:studentId
Authorization: Bearer <accessToken>
```

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "title": "Software Engineering Internship",
    "type": "INTERNSHIP",
    "organization": "Tech Company Ltd",
    "description": "3-month internship program",
    "requirements": ["Basic programming", "English proficiency"],
    "deadline": "2024-02-28",
    "matchScore": 85,
    "isActive": true
  }
]
```

**Opportunity Types**:
- `JOB` - Full-time job
- `INTERNSHIP` - Internship
- `SCHOLARSHIP` - Scholarship
- `UNIVERSITY` - University program

#### Create Application
```http
POST /api/career/applications
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "studentId": "uuid",
  "opportunityId": "uuid",
  "coverLetter": "I am interested in this position...",
  "cvUrl": "https://cloudinary.com/cv.pdf"
}
```

---

### Admin Endpoints

#### Dashboard Overview
```http
GET /api/admin/dashboard/overview
Authorization: Bearer <accessToken>
```

**Response (200)**:
```json
{
  "totalStudents": 150,
  "totalMentors": 20,
  "activeModules": 25,
  "completedSessions": 300,
  "pendingSubmissions": 45,
  "systemHealth": "HEALTHY"
}
```

#### Bulk Import Students
```http
POST /api/bulk/students/import
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

{
  "file": <CSV File>
}
```

**CSV Format**:
```csv
firstName,lastName,email,dateOfBirth,gender,schoolName,gradeLevel
John,Doe,john@example.com,2005-03-15,MALE,GS Ruyenzi,S4
```

#### Get All Users
```http
GET /api/admin/users?role=STUDENT&page=1&limit=20
Authorization: Bearer <accessToken>
```

---

## 📊 Data Models

### User Object
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Student Profile Object
```typescript
{
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phoneNumber: string;
  address: string;
  schoolName: string;
  gradeLevel: string;
  stream: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelationship: string;
  hasComputer: boolean;
  hasInternet: boolean;
  internetAccess: "HOME_WIFI" | "MOBILE_DATA" | "SCHOOL" | "NONE";
}
```

### Learning Module Object
```typescript
{
  id: string;
  title: string;
  description: string;
  category: "ENGLISH" | "DIGITAL_LITERACY" | "CAREER";
  skillType: "LISTENING" | "SPEAKING" | "READING" | "WRITING" | "COMPUTER_BASICS" | "EMAIL" | "INTERNET_SAFETY" | "CV_BUILDING";
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedDuration: number;
  orderIndex: number;
  isActive: boolean;
  exercises: Exercise[];
}
```

### Exercise Object
```typescript
{
  id: string;
  moduleId: string;
  title: string;
  type: "AUDIO_RECORDING" | "TEXT" | "MULTIPLE_CHOICE" | "FILE_UPLOAD";
  instructions: string;
  content: string;
  maxScore: number;
  rubric: object;
}
```

### Progress Object
```typescript
{
  id: string;
  studentId: string;
  moduleId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  progress: number; // 0-100
  score: number;
  startedAt: string;
  completedAt: string | null;
}
```

### Mentorship Session Object
```typescript
{
  id: string;
  mentorId: string;
  studentId: string;
  scheduledDate: string;
  duration: number;
  sessionType: "ONE_ON_ONE" | "GROUP" | "LAB";
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  topic: string;
  notes: string;
}
```

### Message Object
```typescript
{
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl: string | null;
  isRead: boolean;
  sentAt: string;
}
```

### Opportunity Object
```typescript
{
  id: string;
  title: string;
  type: "JOB" | "INTERNSHIP" | "SCHOLARSHIP" | "UNIVERSITY";
  organization: string;
  description: string;
  requirements: string[];
  location: string;
  deadline: string;
  isActive: boolean;
  createdAt: string;
}
```

---

## 📤 File Upload Requirements

### Audio Files
- **Endpoint**: `POST /api/audio/upload`
- **Max Size**: 10MB
- **Formats**: mp3, wav, m4a, ogg
- **Field Name**: `audio`
- **Additional Fields**: `studentId`, `exerciseId`

### Document Files (CV, Cover Letter)
- **Endpoint**: `POST /api/files/upload`
- **Max Size**: 5MB
- **Formats**: pdf, doc, docx
- **Field Name**: `file`

### Profile Pictures
- **Endpoint**: `POST /api/users/avatar`
- **Max Size**: 2MB
- **Formats**: jpg, jpeg, png
- **Field Name**: `avatar`

### CSV Import
- **Endpoint**: `POST /api/bulk/students/import`
- **Max Size**: 5MB
- **Format**: csv
- **Field Name**: `file`

### Example Upload Code (JavaScript)
```javascript
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('studentId', studentId);
formData.append('exerciseId', exerciseId);

const response = await fetch('http://localhost:5000/api/audio/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request format/validation |
| 401 | Unauthorized | Refresh token or redirect to login |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 422 | Validation Error | Fix validation errors |
| 429 | Too Many Requests | Rate limit exceeded, retry later |
| 500 | Server Error | Show error message, retry |

### Error Codes
- `INVALID_CREDENTIALS` - Wrong email/password
- `TOKEN_EXPIRED` - Access token expired, refresh needed
- `VALIDATION_ERROR` - Input validation failed
- `DUPLICATE_EMAIL` - Email already registered
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `UNAUTHORIZED_ACCESS` - Insufficient permissions
- `FILE_TOO_LARGE` - Uploaded file exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file format

### Frontend Error Handling Example
```javascript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, refresh or redirect to login
      await refreshToken();
      // Retry request
    } else if (response.status === 403) {
      // Insufficient permissions
      showError('You do not have permission to perform this action');
    } else {
      const error = await response.json();
      showError(error.error || 'An error occurred');
    }
  }
  
  return await response.json();
} catch (error) {
  showError('Network error. Please check your connection.');
}
```

---

## ✅ Best Practices

### 1. Token Management
- Store access token securely (not in localStorage for production)
- Implement automatic token refresh before expiration
- Clear tokens on logout
- Handle 401 errors globally

### 2. API Request Handling
- Show loading states during API calls
- Implement request timeout (30 seconds recommended)
- Retry failed requests (except 4xx errors)
- Cache responses when appropriate

### 3. Form Validation
- Validate on frontend before API call
- Match backend validation rules
- Show clear error messages
- Disable submit button during submission

### 4. File Uploads
- Show upload progress
- Validate file size/type before upload
- Handle upload failures gracefully
- Compress large files when possible

### 5. Real-time Updates
- Poll for new messages every 30 seconds
- Refresh session list before scheduled time
- Update notification count periodically
- Consider WebSocket for real-time features (future)

### 6. Pagination
- Default page size: 20 items
- Include page and limit in query params
- Show total count and page numbers
- Implement infinite scroll or pagination controls

### 7. Search & Filtering
- Debounce search input (300ms)
- Send search params as query strings
- Clear filters option
- Show "no results" state

### 8. Accessibility
- Use semantic HTML
- Include ARIA labels
- Keyboard navigation support
- Screen reader friendly

### 9. Performance
- Lazy load routes/components
- Optimize images before upload
- Minimize API calls
- Cache static data (modules, etc.)

### 10. Security
- Never log sensitive data
- Sanitize user input
- Use HTTPS in production
- Implement CSRF protection

---

## 🔄 State Management Recommendations

### User State
```javascript
{
  user: {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string
  },
  accessToken: string,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

### Student Dashboard State
```javascript
{
  profile: StudentProfile,
  progress: Progress[],
  upcomingSessions: Session[],
  unreadMessages: number,
  recentSubmissions: Submission[]
}
```

### Learning State
```javascript
{
  modules: Module[],
  currentModule: Module | null,
  currentExercise: Exercise | null,
  submissions: Submission[]
}
```

---

## 📱 Responsive Design Requirements

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile-First Features
- Touch-friendly buttons (min 44x44px)
- Simplified navigation
- Optimized file uploads
- Offline support (future)

---

## 🧪 Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token refresh
- [ ] Logout
- [ ] Password reset flow

### Student Features
- [ ] View learning modules
- [ ] Submit text exercise
- [ ] Submit audio recording
- [ ] View progress dashboard
- [ ] Send message to mentor
- [ ] View upcoming sessions

### Mentor Features
- [ ] View assigned students
- [ ] Evaluate submissions
- [ ] Schedule session
- [ ] Send message to student
- [ ] View student progress

### Admin Features
- [ ] View dashboard overview
- [ ] Import students (CSV)
- [ ] Manage users
- [ ] View system analytics

### Error Scenarios
- [ ] Network failure
- [ ] Token expiration
- [ ] Invalid input
- [ ] File upload failure
- [ ] Permission denied

---

## 📞 Support

For questions or issues:
- Backend Developer: admin@edubridge.rw
- API Issues: Open GitHub issue
- Documentation Updates: Submit PR

---

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial API release
- Authentication system
- Learning modules
- Mentorship system
- Career guidance
- Admin dashboard

---

**Last Updated**: January 2024  
**API Version**: 1.0.0  
**Maintained by**: EDU-Bridge Development Team
