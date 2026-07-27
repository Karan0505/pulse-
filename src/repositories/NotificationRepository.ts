import { prisma } from '../prisma/client';
import { Notification, Prisma, NotificationType } from '@prisma/client';

export class NotificationRepository {
  public static async create(data: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || NotificationType.GENERAL,
        link: data.link,
      },
    });
  }

  public static async findByUserId(userId: string, limit: number = 20): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  public static async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  public static async markAllAsRead(userId: string): Promise<Prisma.BatchPayload> {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
