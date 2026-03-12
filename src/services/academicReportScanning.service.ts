import prisma from '../config/database';

interface ExtractedGrade {
  subject: string;
  score: number;
  maxScore: number;
  grade?: string;
}

interface ScanResult {
  studentId: string;
  term: string;
  year: number;
  grades: ExtractedGrade[];
  overallAverage: number;
  extractedAt: Date;
  confidence: number;
}

interface OCRResult {
  text: string;
  confidence: number;
}

// Mock OCR function - replace with actual OCR service (Tesseract, AWS Textract, Google Vision API)
async function performOCR(fileBuffer: Buffer): Promise<OCRResult> {
  // TODO: Integrate with actual OCR service
  // Example: Tesseract.js, AWS Textract, or Google Cloud Vision API
  return {
    text: "Sample OCR text from report card",
    confidence: 0.85
  };
}

// Parse extracted text to identify grades
function parseGradesFromText(text: string): ExtractedGrade[] {
  const grades: ExtractedGrade[] = [];
  const lines = text.split('\n');
  
  // Common subject patterns
  const subjectPatterns = [
    /(?:English|Mathematics|Math|Science|Physics|Chemistry|Biology|History|Geography|Kinyarwanda|French|ICT|Computer|PE|Physical Education|Art|Music)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:\/|out of)?\s*(\d+)/gi,
    /(\w+(?:\s+\w+)?)\s+(\d+(?:\.\d+)?)\s*\/\s*(\d+)/g
  ];

  for (const line of lines) {
    for (const pattern of subjectPatterns) {
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[2]) {
          const subject = match[1].trim();
          const score = parseFloat(match[2]);
          const maxScore = match[3] ? parseFloat(match[3]) : 100;
          
          if (!isNaN(score) && !isNaN(maxScore)) {
            grades.push({
              subject,
              score,
              maxScore,
              grade: calculateLetterGrade(score, maxScore)
            });
          }
        }
      }
    }
  }

  return grades;
}

function calculateLetterGrade(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export const academicReportScanningService = {
  // Scan and extract data from academic report
  async scanReport(
    fileBuffer: Buffer,
    studentId: string,
    term: string,
    year: number
  ): Promise<ScanResult> {
    const ocrResult = await performOCR(fileBuffer);
    const grades = parseGradesFromText(ocrResult.text);
    
    const overallAverage = grades.length > 0
      ? grades.reduce((sum: number, g: ExtractedGrade) => sum + (g.score / g.maxScore) * 100, 0) / grades.length
      : 0;

    return {
      studentId,
      term,
      year,
      grades,
      overallAverage,
      extractedAt: new Date(),
      confidence: ocrResult.confidence
    };
  },

  // Save scanned report data to database
  async saveScannedReport(scanResult: ScanResult) {
    const student = await prisma.student.findUnique({
      where: { id: scanResult.studentId }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Store in AcademicRecord
    const academicRecord = await prisma.academicRecord.create({
      data: {
        studentId: scanResult.studentId,
        term: scanResult.term,
        year: scanResult.year,
        overallGrade: scanResult.overallAverage,
        subjects: scanResult.grades as any,
        scannedAt: scanResult.extractedAt,
        scanConfidence: scanResult.confidence
      }
    });

    // Update student's academic performance
    await prisma.student.update({
      where: { id: scanResult.studentId },
      data: {
        academicPerformance: scanResult.overallAverage
      }
    });

    return academicRecord;
  },

  // Process and save in one operation
  async processReport(
    fileBuffer: Buffer,
    studentId: string,
    term: string,
    year: number
  ) {
    const scanResult = await this.scanReport(fileBuffer, studentId, term, year);
    return await this.saveScannedReport(scanResult);
  },

  // Manual correction of scanned data
  async correctScannedData(
    recordId: string,
    corrections: {
      grades?: ExtractedGrade[];
      overallGrade?: number;
    }
  ) {
    const updates: any = {};
    
    if (corrections.grades) {
      updates.subjects = corrections.grades;
      const overallAverage = corrections.grades.reduce(
        (sum: number, g: ExtractedGrade) => sum + (g.score / g.maxScore) * 100,
        0
      ) / corrections.grades.length;
      updates.overallGrade = overallAverage;
    }
    
    if (corrections.overallGrade !== undefined) {
      updates.overallGrade = corrections.overallGrade;
    }

    return await prisma.academicRecord.update({
      where: { id: recordId },
      data: updates
    });
  },

  // Get all scanned reports for a student
  async getStudentScannedReports(studentId: string) {
    return await prisma.academicRecord.findMany({
      where: {
        studentId,
        scannedAt: { not: null }
      },
      orderBy: [
        { year: 'desc' },
        { term: 'desc' }
      ]
    });
  },

  // Get low confidence scans that need review
  async getLowConfidenceScans(threshold: number = 0.7) {
    return await prisma.academicRecord.findMany({
      where: {
        scanConfidence: { lt: threshold },
        scannedAt: { not: null }
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { scanConfidence: 'asc' }
    });
  }
};
