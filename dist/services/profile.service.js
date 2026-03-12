"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = exports.updateMentorNotes = exports.updateStudentProfile = exports.getStudentProfile = void 0;
// src/services/profile.service.ts
const database_1 = __importDefault(require("../config/database"));
const logger_1 = require("../utils/logger");
// ─────────────────────────────────────────────────────────────
// GET STUDENT PROFILE (SRS FR 2, NFR 10)
// ─────────────────────────────────────────────────────────────
const getStudentProfile = async (userId, requesterRole) => {
    // NFR 10: Role-based data filtering
    const selectFields = {
        id: true,
        userId: true,
        fullName: true,
        dateOfBirth: true,
        nationalId: true,
        schoolName: true,
        gradeLevel: true,
        guardianName: true,
        guardianContact: true,
        relationship: true,
        homeAddress: true,
        district: true,
        province: true,
        createdAt: true,
        updatedAt: true,
    };
    // Only mentors and admins can see sensitive socio-economic data
    if (requesterRole === 'MENTOR' || requesterRole === 'ADMIN') {
        selectFields.familyIncome = true;
        selectFields.occupation = true;
        selectFields.livingConditions = true;
        selectFields.mentorNotes = true;
    }
    const profile = await database_1.default.studentProfile.findUnique({
        where: { userId },
        select: selectFields,
    });
    if (!profile) {
        throw new Error('Student profile not found');
    }
    return profile;
};
exports.getStudentProfile = getStudentProfile;
// ─────────────────────────────────────────────────────────────
// UPDATE STUDENT PROFILE (SRS FR 2.1 - 2.4)
// ─────────────────────────────────────────────────────────────
const updateStudentProfile = async (userId, data, requesterId, requesterRole, ipAddress) => {
    // NFR 10: Students can only update their own basic info
    // Mentors/Admins can update all fields including sensitive data
    const allowedFields = {
        fullName: data.fullName,
        schoolName: data.schoolName,
        gradeLevel: data.gradeLevel,
        guardianName: data.guardianName,
        guardianContact: data.guardianContact,
        relationship: data.relationship,
        homeAddress: data.homeAddress,
        district: data.district,
        province: data.province,
    };
    // Only mentors/admins can update sensitive socio-economic data
    if (requesterRole === 'MENTOR' || requesterRole === 'ADMIN') {
        allowedFields.familyIncome = data.familyIncome;
        allowedFields.occupation = data.occupation;
        allowedFields.livingConditions = data.livingConditions;
    }
    // Remove undefined values
    Object.keys(allowedFields).forEach((key) => allowedFields[key] === undefined && delete allowedFields[key]);
    const profile = await database_1.default.studentProfile.update({
        where: { userId },
        data: allowedFields,
    });
    // NFR 5: Audit logging
    await (0, logger_1.logAudit)(requesterId, 'PROFILE_UPDATE', { userId, updatedFields: Object.keys(allowedFields) }, ipAddress);
    return profile;
};
exports.updateStudentProfile = updateStudentProfile;
// ─────────────────────────────────────────────────────────────
// UPDATE MENTOR NOTES (SRS FR 2.5 - Confidential)
// ─────────────────────────────────────────────────────────────
const updateMentorNotes = async (userId, data, requesterId, requesterRole, ipAddress) => {
    // NFR 10: Only mentors and admins can add/edit confidential notes
    if (requesterRole !== 'MENTOR' && requesterRole !== 'ADMIN') {
        throw new Error('Unauthorized: Only mentors and administrators can add notes');
    }
    const profile = await database_1.default.studentProfile.update({
        where: { userId },
        data: { mentorNotes: data.mentorNotes },
    });
    // NFR 5: Audit logging for sensitive action
    await (0, logger_1.logAudit)(requesterId, 'PROFILE_UPDATE', { userId, action: 'mentor_notes_updated' }, ipAddress);
    return profile;
};
exports.updateMentorNotes = updateMentorNotes;
// ─────────────────────────────────────────────────────────────
// GET ALL STUDENTS (ADMIN ONLY - SRS 2.3)
// ─────────────────────────────────────────────────────────────
const getAllStudents = async (requesterId, filters) => {
    const whereClause = {};
    if (filters?.district) {
        whereClause.district = filters.district;
    }
    if (filters?.gradeLevel) {
        whereClause.gradeLevel = filters.gradeLevel;
    }
    const students = await database_1.default.studentProfile.findMany({
        where: whereClause,
        select: {
            id: true,
            userId: true,
            fullName: true,
            schoolName: true,
            gradeLevel: true,
            district: true,
            createdAt: true,
            user: {
                select: {
                    email: true,
                    role: true,
                    isActive: true,
                },
            },
        },
    });
    // NFR 5: Audit logging
    await (0, logger_1.logAudit)(requesterId, 'PROFILE_UPDATE', { action: 'viewed_all_students' });
    return students;
};
exports.getAllStudents = getAllStudents;
//# sourceMappingURL=profile.service.js.map