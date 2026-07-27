import { NotificationRepository } from '../repositories/NotificationRepository';
import { pubsub } from '../events/pubsub';
import { PubSubTriggers } from '../constants';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  public static async sendNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
  }) {
    const notification = await NotificationRepository.create(data);

    // Publish to GraphQL Subscriptions
    pubsub.publish(PubSubTriggers.NOTIFICATION_CREATED, {
      notificationCreated: notification,
    });

    return notification;
  }

  public static async getUserNotifications(userId: string) {
    return NotificationRepository.findByUserId(userId);
  }

  public static async markRead(id: string) {
    return NotificationRepository.markAsRead(id);
  }
}
