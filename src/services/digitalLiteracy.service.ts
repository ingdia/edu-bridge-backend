// src/services/digitalLiteracy.service.ts
import prisma from '../config/database';
import { logAudit } from '../utils/logger';

// Digital Literacy Lesson Types
export type DigitalLiteracyLessonType = 
  | 'email' 
  | 'computer_basics' 
  | 'internet_safety' 
  | 'digital_communication'
  | 'file_handling';

export interface DigitalLiteracyLesson {
  id: string;
  title: string;
  type: DigitalLiteracyLessonType;
  description: string;
  content: {
    theory?: string;
    steps?: string[];
    practiceExercises?: any[];
    resources?: string[];
  };
  estimatedDuration: number; // in minutes
  orderIndex: number;
}

// ─────────────────────────────────────────────────────────────
// GET ALL DIGITAL LITERACY LESSONS
// ─────────────────────────────────────────────────────────────

export const getDigitalLiteracyLessons = async (studentId: string) => {
  // Get all lessons with student progress
  const lessons: DigitalLiteracyLesson[] = [
    {
      id: 'dl-001',
      title: 'Introduction to Email',
      type: 'email',
      description: 'Learn how to create, send, and manage emails professionally',
      content: {
        theory: 'Email is a digital way to send messages. It is used for school, work, and personal communication.',
        steps: [
          'Open your email application',
          'Click "Compose" or "New Email"',
          'Enter the recipient\'s email address',
          'Write a clear subject line',
          'Type your message',
          'Click "Send"'
        ],
        practiceExercises: [
          {
            type: 'simulation',
            task: 'Send a practice email to your mentor',
            instructions: 'Write a professional email introducing yourself'
          }
        ],
        resources: ['Email etiquette guide', 'Common email mistakes to avoid']
      },
      estimatedDuration: 30,
      orderIndex: 1
    },
    {
      id: 'dl-002',
      title: 'Computer Basics',
      type: 'computer_basics',
      description: 'Learn fundamental computer operations and file management',
      content: {
        theory: 'Understanding how to use a computer is essential for school and work.',
        steps: [
          'Turn on the computer properly',
          'Use the mouse and keyboard',
          'Open and close programs',
          'Save your work',
          'Shut down properly'
        ],
        practiceExercises: [
          {
            type: 'hands-on',
            task: 'Create a folder and save a document',
            instructions: 'Practice organizing files on the computer'
          }
        ],
        resources: ['Keyboard shortcuts guide', 'File organization tips']
      },
      estimatedDuration: 45,
      orderIndex: 2
    },
    {
      id: 'dl-003',
      title: 'Internet Safety',
      type: 'internet_safety',
      description: 'Learn how to stay safe online and protect your information',
      content: {
        theory: 'The internet is powerful but requires caution. Protect your personal information.',
        steps: [
          'Create strong passwords',
          'Recognize phishing emails',
          'Avoid sharing personal information',
          'Use secure websites (HTTPS)',
          'Report suspicious activity'
        ],
        practiceExercises: [
          {
            type: 'quiz',
            task: 'Identify safe vs unsafe online practices',
            instructions: 'Complete the internet safety quiz'
          }
        ],
        resources: ['Password security guide', 'Online safety checklist']
      },
      estimatedDuration: 40,
      orderIndex: 3
    },
    {
      id: 'dl-004',
      title: 'Digital Communication',
      type: 'digital_communication',
      description: 'Learn professional online communication skills',
      content: {
        theory: 'Communicating online requires professionalism and clarity.',
        steps: [
          'Use appropriate language',
          'Respond promptly',
          'Be clear and concise',
          'Use proper formatting',
          'Respect others online'
        ],
        practiceExercises: [
          {
            type: 'scenario',
            task: 'Write professional messages for different situations',
            instructions: 'Practice writing emails, chat messages, and forum posts'
          }
        ],
        resources: ['Digital communication etiquette', 'Professional writing tips']
      },
      estimatedDuration: 35,
      orderIndex: 4
    },
    {
      id: 'dl-005',
      title: 'Safe File Handling',
      type: 'file_handling',
      description: 'Learn to download, upload, and manage files safely',
      content: {
        theory: 'Proper file handling prevents data loss and security issues.',
        steps: [
          'Download files from trusted sources',
          'Scan files for viruses',
          'Organize files in folders',
          'Backup important files',
          'Delete unnecessary files'
        ],
        practiceExercises: [
          {
            type: 'practical',
            task: 'Download, organize, and upload a file',
            instructions: 'Complete the file management exercise'
          }
        ],
        resources: ['File types guide', 'Cloud storage basics']
      },
      estimatedDuration: 30,
      orderIndex: 5
    }
  ];

  // Get student's progress for these lessons
  const progress = await prisma.digitalLiteracyProgress.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' }
  });

  // Merge lessons with progress
  const lessonsWithProgress = lessons.map(lesson => {
    const studentProgress = progress.find(p => p.lessonTitle === lesson.title);
    return {
      ...lesson,
      progress: studentProgress ? {
        completed: studentProgress.completed,
        score: studentProgress.score,
        completedAt: studentProgress.completedAt
      } : null
    };
  });

  await logAudit(studentId, 'MODULE_LIST', { type: 'digital_literacy' });

  return lessonsWithProgress;
};

// ─────────────────────────────────────────────────────────────
// START A DIGITAL LITERACY LESSON
// ─────────────────────────────────────────────────────────────

export const startDigitalLiteracyLesson = async (
  studentId: string,
  lessonTitle: string,
  lessonType: DigitalLiteracyLessonType
) => {
  // Check if progress already exists
  const existing = await prisma.digitalLiteracyProgress.findFirst({
    where: {
      studentId,
      lessonTitle,
      lessonType
    }
  });

  if (existing && !existing.completed) {
    return existing;
  }

  // Create new progress record
  const progress = await prisma.digitalLiteracyProgress.create({
    data: {
      studentId,
      lessonTitle,
      lessonType,
      completed: false,
      practiceData: {}
    }
  });

  await logAudit(studentId, 'DIGITAL_LITERACY_LESSON_STARTED', {
    lessonTitle,
    lessonType
  });

  return progress;
};

// ─────────────────────────────────────────────────────────────
// COMPLETE A DIGITAL LITERACY LESSON
// ─────────────────────────────────────────────────────────────

export const completeDigitalLiteracyLesson = async (
  studentId: string,
  lessonTitle: string,
  score?: number,
  practiceData?: any
) => {
  const progress = await prisma.digitalLiteracyProgress.updateMany({
    where: {
      studentId,
      lessonTitle,
      completed: false
    },
    data: {
      completed: true,
      score: score || null,
      completedAt: new Date(),
      practiceData: practiceData || {}
    }
  });

  await logAudit(studentId, 'DIGITAL_LITERACY_LESSON_COMPLETED', {
    lessonTitle,
    score
  });

  return progress;
};

// ─────────────────────────────────────────────────────────────
// GET STUDENT'S DIGITAL LITERACY PROGRESS SUMMARY
// ─────────────────────────────────────────────────────────────

export const getDigitalLiteracyProgressSummary = async (studentId: string) => {
  const allProgress = await prisma.digitalLiteracyProgress.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' }
  });

  const totalLessons = 5; // Total number of digital literacy lessons
  const completedLessons = allProgress.filter(p => p.completed).length;
  const averageScore = allProgress.filter(p => p.score !== null).length > 0
    ? allProgress.reduce((sum: number, p: any) => sum + (p.score || 0), 0) / 
      allProgress.filter(p => p.score !== null).length
    : null;

  return {
    totalLessons,
    completedLessons,
    inProgress: totalLessons - completedLessons,
    completionRate: ((completedLessons / totalLessons) * 100).toFixed(1),
    averageScore: averageScore ? parseFloat(averageScore.toFixed(1)) : null,
    recentActivity: allProgress.slice(0, 5)
  };
};
