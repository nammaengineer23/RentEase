import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // ===============================
  // Get My Notifications
  // ===============================

  @Get()
  getMyNotifications(
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.getMyNotifications(
      user,
    );
  }

  // ===============================
  // Mark One Read
  // ===============================

  @Patch(':id/read')
  markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.markAsRead(
      id,
      user,
    );
  }

  // ===============================
  // Mark All Read
  // ===============================

  @Patch('read-all')
  markAllAsRead(
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.markAllAsRead(
      user,
    );
  }

  // ===============================
  // Delete Notification
  // ===============================

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.remove(
      id,
      user,
    );
  }
}