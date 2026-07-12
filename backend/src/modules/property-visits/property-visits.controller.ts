import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

import { PropertyVisitsService } from './property-visits.service';
import { VisitStatus } from '@prisma/client';
import { CreatePropertyVisitDto } from './dto/create-property-visit.dto';
import { UpdatePropertyVisitDto } from './dto/update-property-visit.dto';

@ApiTags('Property Visits')
@Controller('property-visits')
export class PropertyVisitsController {
  constructor(
    private readonly propertyVisitsService: PropertyVisitsService,
  ) {}

  // =====================================
  // Create Visit Request
  // =====================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Book property visit',
  })
  create(
    @Body()
    dto: CreatePropertyVisitDto,

    @Request()
    req: any,
  ) {
    return this.propertyVisitsService.create(
      dto,
      req.user,
    );
  }


  // =====================================
  // Owner Visit Requests
  // =====================================

  @Get('owner')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get owner visit requests',
  })
  getOwnerVisits(
    @Request()
    req: any,
  ) {
    return this.propertyVisitsService.getOwnerVisits(
      req.user,
    );
  }

  // =====================================
  // Get All Visits
  // =====================================

  @Get()
  findAll() {
    return this.propertyVisitsService.findAll();
  }

  // =====================================
  // Get Visit
  // =====================================

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.propertyVisitsService.findOne(
      id,
    );
  }

  // =====================================
  // Approve Visit
  // =====================================

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  approveVisit(
    @Param('id')
    id: string,

    @Request()
    req: any,
  ) {
    return this.propertyVisitsService.approveVisit(
      id,
      req.user,
    );
  }

  // =====================================
  // Reject Visit
  // =====================================

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  rejectVisit(
    @Param('id')
    id: string,

    @Request()
    req: any,
  ) {
    return this.propertyVisitsService.rejectVisit(
      id,
      req.user,
    );
  }

  // =====================================
  // Complete Visit
  // =====================================

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  completeVisit(
    @Param('id')
    id: string,

    @Request()
    req: any,
  ) {
    return this.propertyVisitsService.completeVisit(
      id,
      req.user,
    );
  }

  // =====================================
  // Cancel Visit
  // =====================================

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancelVisit(
    @Param('id')
    id: string,

    @Request()
    req: any,
  ) {
    return this.propertyVisitsService.cancelVisit(
      id,
      req.user,
    );
  }

  // =====================================
  // Update Visit
  // =====================================

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdatePropertyVisitDto,
  ) {
    return this.propertyVisitsService.update(
      id,
      dto,
    );
  }

  // =====================================
  // Delete Visit
  // =====================================

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.propertyVisitsService.remove(
      id,
    );
  }
}