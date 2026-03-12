import prisma from '../config/database';
import { logAudit } from '../utils/logger';
import { UploadAcademicReportInput, ManualEntryInput } from '../validators/academic.validator';
import { uploadToCloudinary, deleteFromCloudinary, UploadResult } from '../utils/fileUpload';

export class AcademicReportService {
  static async uploadReport(data: UploadAcademicReportInput, adminId: string, file?: Express.Multer.File) {
    let uploadResult: UploadResult | null = null;

    // Upload file to Cloudinary if provided
    if (file) {
      uploadResult = await uploadToCloudinary(
        file.buffer,
        file.originalname,
        'ACADEMIC_REPORT'
      );
    }

    const report = await prisma.academicReport.create({
      data: {
        ...data,
        fileUrl: uploadResult?.url || data.fileUrl,
        fileName: file?.originalname || data.fileName,
        fileSize: file?.size || data.fileSize,
        enteredBy: adminId,
      },
      include: {
        student: {
          select: { fullName: true, gradeLevel: true },
        },
      },
    });

    await logAudit(adminId, 'ACADEMIC_REPORT_UPLOAD', { 
      reportId: report.id, 
      studentId: data.studentId,
      fileUrl: uploadResult?.url,
    });

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

  static async deleteReport(reportId: string, adminId: string) {
    const report = await prisma.academicReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    // Delete file from Cloudinary if exists
    if (report.fileUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = report.fileUrl.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
        await deleteFromCloudinary(publicId, 'auto');
      } catch (error) {
        console.error('[DELETE_FILE_ERROR]', error);
        // Continue with database deletion even if file deletion fails
      }
    }

    await prisma.academicReport.delete({
      where: { id: reportId },
    });

    await logAudit(adminId, 'REPORT_VIEW', { reportId, action: 'deleted' });

    return { message: 'Report deleted successfully' };
  }
}
