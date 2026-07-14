import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { OwnerDashboardService } from './owner-dashboard.service';

@ApiTags('Owner Dashboard')
@Controller('owner/dashboard')
export class OwnerDashboardController {
  constructor(
    private readonly ownerDashboardService: OwnerDashboardService,
  ) {}

  @Get('properties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
getMyProperties(
  @CurrentUser() user: any,
) {
  return this.ownerDashboardService.getMyProperties(user.id);
}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getDashboard(
    @CurrentUser() user: any,
  ) {
    return this.ownerDashboardService.getDashboard(
      user.id,
    );
  }
}

