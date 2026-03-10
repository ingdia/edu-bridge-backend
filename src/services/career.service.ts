import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { CreateCVInput, CreateJobApplicationInput, UpdateApplicationStatusInput } from '../validators/career.validator';

export class CareerService {
  static async createOrUpdateCV(data: CreateCVInput, studentUserId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const cv = await prisma.cV.upsert({
      where: { studentId: studentProfile.id },
      update: data,
      create: {
        ...data,
        studentId: studentProfile.id,
      },
    });

    await logAudit(studentUserId, 'CV_UPDATE', { cvId: cv.id });

    return { data: cv, message: 'CV saved successfully' };
  }

  static async getStudentCV(studentUserId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const cv = await prisma.cV.findUnique({
      where: { studentId: studentProfile.id },
    });

    return { data: cv, message: 'CV retrieved successfully' };
  }

  static async createApplication(data: CreateJobApplicationInput, studentUserId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const application = await prisma.jobApplication.create({
      data: {
        ...data,
        studentId: studentProfile.id,
      },
    });

    await logAudit(studentUserId, 'APPLICATION_CREATE', { applicationId: application.id });

    return { data: application, message: 'Application created successfully' };
  }

  static async updateApplicationStatus(applicationId: string, data: UpdateApplicationStatusInput, userId: string) {
    const application = await prisma.jobApplication.update({
      where: { id: applicationId },
      data,
    });

    await logAudit(userId, 'APPLICATION_UPDATE', { applicationId, status: data.status });

    return { data: application, message: 'Application updated successfully' };
  }

  static async getStudentApplications(studentUserId: string) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
    });

    if (!studentProfile) {
      throw new Error('Student profile not found');
    }

    const applications = await prisma.jobApplication.findMany({
      where: { studentId: studentProfile.id },
      include: {
        cv: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: applications, message: 'Applications retrieved successfully' };
  }
}
