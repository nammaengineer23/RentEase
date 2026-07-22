import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { serializePrisma } from '../../common/utils/prisma-response.util';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // Create Notification (Internal)
  // ==========================================

  async createNotification(
    userId: string,
    title: string,
    message: string,
  ) {
    const notification =
      await this.prisma.notification.create({
        data: {
          userId,
          title,
          message,
        },
      });

    return serializePrisma(notification);
  }

  // ==========================================
  // Get Logged-in User Notifications
  // ==========================================

  async getMyNotifications(user: any) {
    const notifications =
      await this.prisma.notification.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return {
      success: true,
      total: notifications.length,
      notifications: serializePrisma(
        notifications,
      ),
    };
  }

    // ==========================================
  // Mark Single Notification as Read
  // ==========================================

  async markAsRead(
    id: string,
    user: any,
  ) {
    const notification =
      await this.prisma.notification.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found.',
      );
    }

    const updated =
      await this.prisma.notification.update({
        where: {
          id,
        },
        data: {
          isRead: true,
        },
      });

    return {
      success: true,
      message:
        'Notification marked as read.',
      notification: serializePrisma(updated),
    };
  }

  // ==========================================
  // Mark All Notifications as Read
  // ==========================================

  async markAllAsRead(user: any) {
    await this.prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      success: true,
      message:
        'All notifications marked as read.',
    };
  }

  // ==========================================
  // Delete Notification
  // ==========================================

  async remove(
    id: string,
    user: any,
  ) {
    const notification =
      await this.prisma.notification.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found.',
      );
    }

    await this.prisma.notification.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message:
        'Notification deleted successfully.',
    };
  }
}