import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { MailModule } from '../../mail/mail.module';
import { NotificationsModule } from '../notifications/notifications.module';

import { PropertyVisitsController } from './property-visits.controller';
import { PropertyVisitsService } from './property-visits.service';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    NotificationsModule,
  ],
  controllers: [PropertyVisitsController],
  providers: [PropertyVisitsService],
})
export class PropertyVisitsModule {}