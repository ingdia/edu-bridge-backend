import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { UploadAcademicReportInput, ManualEntryInput } from '../validators/academic.validator';

export class AcademicReportService {
  static async uploadReport(data: UploadAcademicReportInput, adminId: string) {
    const report = await prisma.academicReport.create({
      data: {
        ...data,
        enteredBy: adminId,
      },
      include: {
        student: {
          select: { fullName: true, gradeLevel: true },
        },
      },
    });

    await logAudit(adminId, 'ACADEMIC_REPORT_UPLOAD', { reportId: report.id, studentId: data.studentId });

    return { data: report, message: 'Academic report uploaded successfully' };
  }

  static async manualEntry(data: ManualEntryInput, adminId: string) {
    const report = await prisma.academicReport.create({
      data: {
        ...data,
        fileUrl: '',
        enteredBy: adminId,
      },
      include: {
        student: {
          select: { fullName: true, gradeLevel: true },
        },
      },
    });

    await logAudit(adminId, 'ACADEMIC_REPORT_MANUAL_ENTRY', { reportId: report.id, studentId: data.studentId });

    return { data: report, message: 'Academic report entered successfully' };
  }

  static async getStudentReports(studentId: string) {
    const reports = await prisma.academicReport.findMany({
      where: { studentId },
      orderBy: [{ year: 'desc' }, { term: 'desc' }],
    });

    return { data: reports, message: 'Reports retrieved successfully' };
  }
}
