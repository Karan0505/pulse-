import { prisma } from '../prisma/client';
import { ActivityLog } from '@prisma/client';

export class ActivityLogRepository {
  public static async log(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ActivityLog> {
    return prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  public static async findMany(limit: number = 50): Promise<ActivityLog[]> {
    return prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }
}
