"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkOperationsService = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.bulkOperationsService = {
    async importStudents(students, createdBy) {
        const results = [];
        const errors = [];
        for (const studentData of students) {
            try {
                const existingUser = await database_1.default.user.findUnique({
                    where: { email: studentData.email }
                });
                if (existingUser) {
                    errors.push({
                        email: studentData.email,
                        error: 'User already exists'
                    });
                    continue;
                }
                const defaultPassword = await bcryptjs_1.default.hash('EduBridge2024!', 10);
                const user = await database_1.default.user.create({
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
            }
            catch (error) {
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
    async uploadGrades(grades, uploadedBy) {
        const results = [];
        const errors = [];
        for (const gradeData of grades) {
            try {
                const student = await database_1.default.studentProfile.findUnique({
                    where: { nationalId: gradeData.studentNationalId }
                });
                if (!student) {
                    errors.push({
                        nationalId: gradeData.studentNationalId,
                        error: 'Student not found'
                    });
                    continue;
                }
                const academicReport = await database_1.default.academicReport.create({
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
            }
            catch (error) {
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
    async sendBulkNotifications(data, sentBy) {
        const results = [];
        const errors = [];
        for (const recipientId of data.recipientIds) {
            try {
                const student = await database_1.default.studentProfile.findUnique({
                    where: { id: recipientId }
                });
                if (!student) {
                    errors.push({
                        recipientId,
                        error: 'Student not found'
                    });
                    continue;
                }
                const notification = await database_1.default.notification.create({
                    data: {
                        recipientId,
                        type: data.type,
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
            }
            catch (error) {
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
    async assignMentorsToStudents(assignments) {
        const results = [];
        const errors = [];
        for (const assignment of assignments) {
            try {
                const mentor = await database_1.default.mentorProfile.findUnique({
                    where: { id: assignment.mentorId }
                });
                if (!mentor) {
                    errors.push({
                        studentId: assignment.studentId,
                        error: 'Mentor not found'
                    });
                    continue;
                }
                const student = await database_1.default.studentProfile.update({
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
            }
            catch (error) {
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
//# sourceMappingURL=bulkOperations.service.js.map