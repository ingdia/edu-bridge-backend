import prisma from '../config/database';

interface AuditLogData {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

export const auditLogService = {
  async log(data: AuditLogData) {
    return await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        details: data.details
      }
    });
  },

  async getUserLogs(userId: string, limit: number = 50) {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });
  },

  async getActionLogs(action: string, startDate?: Date, endDate?: Date) {
    return await prisma.auditLog.findMany({
      where: {
        action,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });
  },

  async getEntityLogs(entityType: string, entityId: string) {
    return await prisma.auditLog.findMany({
      where: {
        entityType,
        entityId
      },
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });
  },

  async getRecentLogs(limit: number = 100) {
    return await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });
  }
};
