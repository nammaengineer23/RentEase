import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user/current-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(
      propertyId,
      user.id,
      dto,
    );
  }

  @Get(':propertyId')
  findByProperty(
    @Param('propertyId') propertyId: string,
  ) {
    return this.reviewsService.findByProperty(propertyId);
  }

  @Get(':propertyId/stats')
  getStats(
    @Param('propertyId') propertyId: string,
  ) {
    return this.reviewsService.getStats(propertyId);
  }
}