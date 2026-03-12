import prisma from '../config/database';
import bcrypt from 'bcryptjs';

interface BulkStudentData {
  email: string;
  fullName: string;
  dateOfBirth: string;
  nationalId: string;
  gradeLevel: string;
  schoolName?: string;
  guardianName?: string;
  guardianContact?: string;
}

interface BulkGradeData {
  studentNationalId: string;
  term: string;
  year: number;
  subjects: any;
  overallGrade: string;
}

interface BulkNotificationData {
  recipientIds: string[];
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
}

export const bulkOperationsService = {
  async importStudents(students: BulkStudentData[], createdBy: string) {
    const results = [];
    const errors = [];

    for (const studentData of students) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: studentData.email }
        });

        if (existingUser) {
          errors.push({
            email: studentData.email,
            error: 'User already exists'
          });
          continue;
        }

        const defaultPassword = await bcrypt.hash('EduBridge2024!', 10);

        const user = await prisma.user.create({
          data: {
            email: studentData.email,
            password: defaultPassword,
            role: 'STUDENT',
            studentProfile: {
              create: {
                fullName: studentData.fullName,
                dateOfBirth: new Date(studentData.dateOfBirth),
                nationalId: studentData.nationalId,
                gradeLevel: studentData.gradeLevel,
                schoolName: studentData.schoolName || 'GS Ruyenzi',
                guardianName: studentData.guardianName,
                guardianContact: studentData.guardianContact
              }
            }
          },
          include: {
            studentProfile: true
          }
        });

        results.push({
          success: true,
          email: studentData.email,
          userId: user.id,
          studentId: user.studentProfile?.id
        });
      } catch (error: any) {
        errors.push({
          email: studentData.email,
          error: error.message
        });
      }
    }

    return {
      total: students.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors
    };
  },

  async uploadGrades(grades: BulkGradeData[], uploadedBy: string) {
    const results = [];
    const errors = [];

    for (const gradeData of grades) {
      try {
        const student = await prisma.studentProfile.findUnique({
          where: { nationalId: gradeData.studentNationalId }
        });

        if (!student) {
          errors.push({
            nationalId: gradeData.studentNationalId,
            error: 'Student not found'
          });
          continue;
        }

        const academicReport = await prisma.academicReport.create({
          data: {
            studentId: student.id,
            term: gradeData.term,
            year: gradeData.year,
            subjects: gradeData.subjects,
            overallGrade: gradeData.overallGrade,
            enteredBy: uploadedBy,
            fileUrl: 'bulk_upload',
            fileName: `bulk_${gradeData.term}_${gradeData.year}.json`
          }
        });

        results.push({
          success: true,
          nationalId: gradeData.studentNationalId,
          studentId: student.id,
          reportId: academicReport.id
        });
      } catch (error: any) {
        errors.push({
          nationalId: gradeData.studentNationalId,
          error: error.message
        });
      }
    }

    return {
      total: grades.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors
    };
  },

  async sendBulkNotifications(data: BulkNotificationData, sentBy: string) {
    const results = [];
    const errors = [];

    for (const recipientId of data.recipientIds) {
      try {
        const student = await prisma.studentProfile.findUnique({
          where: { id: recipientId }
        });

        if (!student) {
          errors.push({
            recipientId,
            error: 'Student not found'
          });
          continue;
        }

        const notification = await prisma.notification.create({
          data: {
            recipientId,
            type: data.type as any,
            title: data.title,
            message: data.message,
            actionUrl: data.actionUrl,
            sentByAdminId: sentBy
          }
        });

        results.push({
          success: true,
          recipientId,
          notificationId: notification.id
        });
      } catch (error: any) {
        errors.push({
          recipientId,
          error: error.message
        });
      }
    }

    return {
      total: data.recipientIds.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors
    };
  },

  async assignMentorsToStudents(assignments: { studentId: string; mentorId: string }[]) {
    const results = [];
    const errors = [];

    for (const assignment of assignments) {
      try {
        const mentor = await prisma.mentorProfile.findUnique({
          where: { id: assignment.mentorId }
        });

        if (!mentor) {
          errors.push({
            studentId: assignment.studentId,
            error: 'Mentor not found'
          });
          continue;
        }

        const student = await prisma.studentProfile.update({
          where: { id: assignment.studentId },
          data: {
            assignedMentorId: assignment.mentorId
          }
        });

        results.push({
          success: true,
          studentId: assignment.studentId,
          mentorId: assignment.mentorId
        });
      } catch (error: any) {
        errors.push({
          studentId: assignment.studentId,
          error: error.message
        });
      }
    }

    return {
      total: assignments.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors
    };
  }
};
