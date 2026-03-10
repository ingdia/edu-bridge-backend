// src/controllers/profile.controller.ts
import prisma from '../config/database';
import { Request, Response, NextFunction } from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  updateMentorNotes,
  getAllStudents,
} from '../services/profile.service';
import { validateUpdateProfile, validateMentorNotes } from '../validators/profile.validator';

// ─────────────────────────────────────────────────────────────
// GET CURRENT USER PROFILE (SRS FR 2, FR 6.1)
// ─────────────────────────────────────────────────────────────

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    const profile = await getStudentProfile(userId, userRole);

    res.status(200).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET SPECIFIC STUDENT PROFILE (Mentor/Admin Only)
// ─────────────────────────────────────────────────────────────

export const getStudentProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId } = req.params;
    const userRole = (req as any).user?.role;

    // Fetch user ID from studentId
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true },
    });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student not found',
      });
      return;
    }

    const profile = await getStudentProfile(studentId, userRole);

    res.status(200).json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE MY PROFILE (SRS FR 2.1 - 2.4)
// ─────────────────────────────────────────────────────────────

export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const requesterId = (req as any).user?.userId;
    const requesterRole = (req as any).user?.role;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const validatedData = validateUpdateProfile(req.body);

    const profile = await updateStudentProfile(
      userId,
      validatedData,
      requesterId,
      requesterRole,
      ipAddress
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE MENTOR NOTES (FR 2.5 - Mentor/Admin Only)
// ─────────────────────────────────────────────────────────────

export const updateMentorNotesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId } = req.params;
    const requesterId = (req as any).user?.userId;
    const requesterRole = (req as any).user?.role;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const validatedData = validateMentorNotes(req.body);

    const profile = await updateMentorNotes(
      studentId,
      validatedData,
      requesterId,
      requesterRole,
      ipAddress
    );

    res.status(200).json({
      success: true,
      message: 'Mentor notes updated successfully',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET ALL STUDENTS (Admin Only - SRS 2.3)
// ─────────────────────────────────────────────────────────────

export const getAllStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requesterId = (req as any).user?.userId;
    const { district, gradeLevel } = req.query;

    const filters: any = {};
    if (district) filters.district = district as string;
    if (gradeLevel) filters.gradeLevel = gradeLevel as string;

    const students = await getAllStudents(requesterId, filters);

    res.status(200).json({
      success: true,
      data: { students, count: students.length },
    });
  } catch (error) {
    next(error);
  }
};