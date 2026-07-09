import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { AmenitiesController } from './amenities.controller';
import { AmenitiesService } from './amenities.service';

@Module({
  imports: [DatabaseModule],

  controllers: [AmenitiesController],

  providers: [AmenitiesService],

  exports: [AmenitiesService],
})
export class AmenitiesModule {}