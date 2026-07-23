import { Module } from '@nestjs/common';

import { UserDevicesController } from './user-devices.controller';
import { UserDevicesService } from './user-devices.service';

import { PrismaService } from '../../database/prisma.service';
import { PushNotificationsModule } from '../push-notifications/push-notifications.module';

@Module({
  imports: [PushNotificationsModule],
  controllers: [UserDevicesController],
  providers: [
    UserDevicesService,
    PrismaService,
  ],
  exports: [UserDevicesService],
})
export class UserDevicesModule {}