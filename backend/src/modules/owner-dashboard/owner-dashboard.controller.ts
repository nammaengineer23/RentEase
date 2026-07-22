import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { OwnerDashboardService } from './owner-dashboard.service';

@ApiTags('Owner Dashboard')
@Controller('owner/dashboard')
export class OwnerDashboardController {
  constructor(
    private readonly ownerDashboardService: OwnerDashboardService,
  ) {}

  // ==========================
  // Dashboard Summary
  // ==========================
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

// ==========================
// Analytics Dashboard
// ==========================
@Get('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
getAnalytics(
  @CurrentUser() user: any,
) {
  return this.ownerDashboardService.getAnalytics(
    user.id,
  );
}
  
  // ==========================
  // Owner Properties
  // ==========================
  @Get('properties')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMyProperties(
    @CurrentUser() user: any,
  ) {
    return this.ownerDashboardService.getMyProperties(
      user.id,
    );
  }

  // ==========================
  // Owner Activity Feed
  // ==========================
  @Get('activity')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getActivity(
    @CurrentUser() user: any,
  ) {
    return this.ownerDashboardService.getActivity(
      user.id,
    );
  }
}