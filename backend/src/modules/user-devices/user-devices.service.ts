import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

import { RegisterDeviceDto } from '../push-notifications/dto/register-device.dto';

@Injectable()
export class UserDevicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  // ==========================================
  // Register Device
  // ==========================================

  async registerDevice(
    userId: string,
    dto: RegisterDeviceDto,
  ) {
    const device =
      await this.pushNotificationsService.registerDevice(
        userId,
        dto,
      );

    return {
      success: true,
      message: 'Device registered successfully.',
      data: device,
    };
  }

  // ==========================================
  // Remove Device
  // ==========================================

  async unregisterDevice(
    userId: string,
    token: string,
  ) {
    await this.pushNotificationsService.unregisterDevice(
      userId,
      token,
    );

    return {
      success: true,
      message: 'Device removed successfully.',
    };
  }

  // ==========================================
  // Get My Devices
  // ==========================================

  async getMyDevices(userId: string) {
    const devices =
      await this.prisma.userDevice.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return {
      success: true,
      total: devices.length,
      data: devices,
    };
  }
}