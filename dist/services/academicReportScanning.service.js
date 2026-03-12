"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicReportScanningService = void 0;
const database_1 = __importDefault(require("../config/database"));
// Mock OCR function - replace with actual OCR service (Tesseract, AWS Textract, Google Vision API)
async function performOCR(fileBuffer) {
    // TODO: Integrate with actual OCR service
    // Example: Tesseract.js, AWS Textract, or Google Cloud Vision API
    return {
        text: "Sample OCR text from report card",
        confidence: 0.85
    };
}
// Parse extracted text to identify grades
function parseGradesFromText(text) {
    const grades = [];
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
function calculateLetterGrade(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90)
        return 'A';
    if (percentage >= 80)
        return 'B';
    if (percentage >= 70)
        return 'C';
    if (percentage >= 60)
        return 'D';
    return 'F';
}
exports.academicReportScanningService = {
    // Scan and extract data from academic report
    async scanReport(fileBuffer, studentId, term, year) {
        const ocrResult = await performOCR(fileBuffer);
        const grades = parseGradesFromText(ocrResult.text);
        const overallAverage = grades.length > 0
            ? grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length
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
    async saveScannedReport(scanResult, fileUrl, enteredBy) {
        const student = await database_1.default.studentProfile.findUnique({
            where: { id: scanResult.studentId }
        });
        if (!student) {
            throw new Error('Student not found');
        }
        // Store in AcademicReport
        const academicRecord = await database_1.default.academicReport.create({
            data: {
                studentId: scanResult.studentId,
                term: scanResult.term,
                year: scanResult.year,
                overallGrade: scanResult.overallAverage.toString(),
                subjects: scanResult.grades,
                fileUrl,
                enteredBy
            }
        });
        return academicRecord;
    },
    // Process and save in one operation
    async processReport(fileBuffer, studentId, term, year, fileUrl, enteredBy) {
        const scanResult = await this.scanReport(fileBuffer, studentId, term, year);
        return await this.saveScannedReport(scanResult, fileUrl, enteredBy);
    },
    // Manual correction of scanned data
    async correctScannedData(recordId, corrections) {
        const updates = {};
        if (corrections.grades) {
            updates.subjects = corrections.grades;
            const overallAverage = corrections.grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / corrections.grades.length;
            updates.overallGrade = overallAverage.toString();
        }
        if (corrections.overallGrade !== undefined) {
            updates.overallGrade = corrections.overallGrade.toString();
        }
        return await database_1.default.academicReport.update({
            where: { id: recordId },
            data: updates
        });
    },
    // Get all scanned reports for a student
    async getStudentScannedReports(studentId) {
        return await database_1.default.academicReport.findMany({
            where: {
                studentId
            },
            orderBy: [
                { year: 'desc' },
                { term: 'desc' }
            ]
        });
    },
    // Get low confidence scans that need review
    async getLowConfidenceScans(threshold = 0.7) {
        return await database_1.default.academicReport.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
//# sourceMappingURL=academicReportScanning.service.js.map