import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import { RegisterDeviceDto } from './dto/register-device.dto';
import { FirebaseService } from '../../firebase/firebase.service';
@Injectable()
export class PushNotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  // ==========================
  // Register Device
  // ==========================
  async registerDevice(
    userId: string,
    dto: RegisterDeviceDto,
  ) {
    return this.prisma.deviceToken.upsert({
      where: {
        token: dto.token,
      },
      update: {
        platform: dto.platform,
        userId,
      },
      create: {
        token: dto.token,
        platform: dto.platform,
        userId,
      },
    });
  }

// ==========================
// Send Notification To User
// ==========================
async sendToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>,
) {
  const devices =
    await this.prisma.deviceToken.findMany({
      where: {
        userId,
      },
    });

  if (devices.length === 0) {
    return {
      success: false,
      message: 'No registered devices',
    };
  }

  const tokens = devices.map(
    (device) => device.token,
  );

  return this.firebaseService.sendToDevices(
    tokens,
    title,
    body,
    data,
  );
}

  // ==========================
  // Remove Device
  // ==========================
  async unregisterDevice(
    userId: string,
    token: string,
  ) {
    await this.prisma.deviceToken.deleteMany({
      where: {
        userId,
        token,
      },
    });

    return {
      message: 'Device removed successfully',
    };
  }
}