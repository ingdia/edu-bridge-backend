import { Request, Response, NextFunction } from 'express';
import { auditLogService } from '../services/auditLog.service';
import prisma from '../config/database';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        await auditLogService.log({
          userId: req.user.userId,
          action: 'ACCESS_DENIED',
          details: {
            attemptedRole: req.user.role,
            requiredRoles: allowedRoles,
            path: req.path,
            method: req.method
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });

        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireStudent = requireRole('STUDENT');
export const requireMentor = requireRole('MENTOR', 'ADMIN');
export const requireAdmin = requireRole('ADMIN');
export const requireMentorOrAdmin = requireRole('MENTOR', 'ADMIN');

export const canAccessStudentData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const targetStudentId = req.params.studentId || req.body.studentId;

    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.role === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: req.user.userId }
      });

      if (studentProfile?.id !== targetStudentId) {
        await auditLogService.log({
          userId: req.user.userId,
          action: 'UNAUTHORIZED_STUDENT_ACCESS',
          entityType: 'StudentProfile',
          entityId: targetStudentId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });

        return res.status(403).json({ error: 'Cannot access other student data' });
      }
    }

    if (req.user.role === 'MENTOR') {
      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId: req.user.userId },
        include: {
          assignedStudents: {
            select: { id: true }
          }
        }
      });

      const hasAccess = mentorProfile?.assignedStudents.some(
        (s: any) => s.id === targetStudentId
      );

      if (!hasAccess) {
        await auditLogService.log({
          userId: req.user.userId,
          action: 'UNAUTHORIZED_MENTOR_ACCESS',
          entityType: 'StudentProfile',
          entityId: targetStudentId,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });

        return res.status(403).json({ error: 'Not assigned to this student' });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const auditAction = (action: string, entityType?: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await auditLogService.log({
          userId: req.user.userId,
          action,
          entityType,
          entityId: req.params.id || req.body.id,
          details: {
            method: req.method,
            path: req.path,
            body: req.body
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
