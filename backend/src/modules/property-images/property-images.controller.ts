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
import { PropertyImagesService } from './property-images.service';

import { UploadPropertyImagesDto } from './dto/upload-property-images.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';

@ApiTags('Property Images')
@Controller('property-images')
export class PropertyImagesController {
  constructor(
    private readonly propertyImagesService: PropertyImagesService,
  ) {}

  // =====================================
  // Upload Images
  // =====================================

  @Post(':propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload Property Images',
  })
  uploadImages(
    @Param('propertyId') propertyId: string,
    @Body() dto: UploadPropertyImagesDto,
    @Request() req: any,
  ) {
    return this.propertyImagesService.uploadImages(
      propertyId,
      dto,
      req.user,
    );
  }

  // =====================================
  // Get Images
  // =====================================

  @Get(':propertyId')
  @ApiOperation({
    summary: 'Get Property Images',
  })
  getImages(
    @Param('propertyId') propertyId: string,
  ) {
    return this.propertyImagesService.getImages(
      propertyId,
    );
  }

  // =====================================
  // Set Primary Image
  // =====================================

  @Patch(':propertyId/primary/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Set Primary Image',
  })
  setPrimary(
    @Param('propertyId') propertyId: string,
    @Param('imageId') imageId: string,
    @Request() req: any,
  ) {
    return this.propertyImagesService.setPrimary(
      propertyId,
      imageId,
      req.user,
    );
  }

  // =====================================
  // Reorder Images
  // =====================================

  @Patch(':propertyId/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reorder Images',
  })
  reorderImages(
    @Param('propertyId') propertyId: string,
    @Body() dto: ReorderImagesDto,
    @Request() req: any,
  ) {
    return this.propertyImagesService.reorderImages(
      propertyId,
      dto,
      req.user,
    );
  }

  // =====================================
  // Delete Image
  // =====================================

  @Delete(':propertyId/:imageId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete Image',
  })
  deleteImage(
    @Param('propertyId') propertyId: string,
    @Param('imageId') imageId: string,
    @Request() req: any,
  ) {
    return this.propertyImagesService.deleteImage(
      propertyId,
      imageId,
      req.user,
    );
  }
}