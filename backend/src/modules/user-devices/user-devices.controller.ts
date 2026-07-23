import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegisterDeviceDto } from '../push-notifications/dto/register-device.dto';
import { UserDevicesService } from './user-devices.service';


@ApiTags('User Devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-devices')
export class UserDevicesController {
  constructor(
    private readonly userDevicesService: UserDevicesService,
  ) {}

  // ==========================================
  // Register Device
  // ==========================================

  @Post('register')
  @ApiOperation({
    summary: 'Register FCM device',
  })
  register(
    @Request() req: any,
    @Body() dto: RegisterDeviceDto,
  ) {
    return this.userDevicesService.registerDevice(
      req.user.id,
      dto,
    );
  }

  // ==========================================
  // Get My Devices
  // ==========================================

  @Get()
  @ApiOperation({
    summary: 'Get my registered devices',
  })
  getMyDevices(
    @Request() req: any,
  ) {
    return this.userDevicesService.getMyDevices(
      req.user.id,
    );
  }

  // ==========================================
  // Remove Device
  // ==========================================

  @Delete('unregister')
  @ApiOperation({
    summary: 'Unregister current device',
  })
  unregister(
    @Request() req: any,
    @Body() dto: RegisterDeviceDto,
  ) {
    return this.userDevicesService.unregisterDevice(
      req.user.id,
      dto.token,
    );
  }
}