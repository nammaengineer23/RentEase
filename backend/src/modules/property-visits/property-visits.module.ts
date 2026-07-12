import { Module } from '@nestjs/common';

import { PropertyVisitsController } from './property-visits.controller';
import { PropertyVisitsService } from './property-visits.service';

import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [PropertyVisitsController],

  providers: [PropertyVisitsService],

  exports: [PropertyVisitsService],
})
export class PropertyVisitsModule {}