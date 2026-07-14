import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================
  // Create Review
  // ==========================
  async create(
    propertyId: string,
    userId: string,
    dto: CreateReviewDto,
  ) {
    const property = await this.prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const existing = await this.prisma.review.findFirst({
      where: {
        propertyId,
        userId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'You have already reviewed this property',
      );
    }

    return this.prisma.review.create({
      data: {
        propertyId,
        userId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  // ==========================
  // Get Reviews
  // ==========================
  async findByProperty(propertyId: string) {
    return this.prisma.review.findMany({
      where: {
        propertyId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ==========================
// Review Statistics
// ==========================
async getStats(propertyId: string) {
  const reviews = await this.prisma.review.findMany({
    where: {
      propertyId,
    },
    select: {
      rating: true,
    },
  });

  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingBreakdown: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const ratingBreakdown = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  let totalRating = 0;

  for (const review of reviews) {
    totalRating += review.rating;

    ratingBreakdown[
      review.rating as keyof typeof ratingBreakdown
    ]++;
  }

  return {
    averageRating: Number(
      (totalRating / totalReviews).toFixed(1),
    ),
    totalReviews,
    ratingBreakdown,
  };
}

  // ==========================
  // Update Review
  // ==========================
  async update(
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto,
  ) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException(
        'You can update only your own review',
      );
    }

    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: dto,
    });
  }

  // ==========================
  // Delete Review
  // ==========================
  async remove(
    reviewId: string,
    userId: string,
  ) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException(
        'You can delete only your own review',
      );
    }

    await this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return {
      message: 'Review deleted successfully',
    };
  }
}