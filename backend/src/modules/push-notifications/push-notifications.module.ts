import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module'; // or ../../database/prisma.module (use your existing path)
import { FirebaseModule } from '../../firebase/firebase.module';

import { PushNotificationsController } from './push-notifications.controller';
import { PushNotificationsService } from './push-notifications.service';

@Module({
  imports: [
    PrismaModule,
    FirebaseModule,
  ],
  controllers: [PushNotificationsController],
  providers: [PushNotificationsService],
  exports: [PushNotificationsService],
})
export class PushNotificationsModule {}