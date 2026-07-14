import { Module } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import { OwnerDashboardController } from './owner-dashboard.controller';
import { OwnerDashboardService } from './owner-dashboard.service';

@Module({
  controllers: [OwnerDashboardController],
  providers: [
    OwnerDashboardService,
    PrismaService,
  ],
})
export class OwnerDashboardModule {}