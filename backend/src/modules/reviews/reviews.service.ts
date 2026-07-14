import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Review
async create(
  userId: string,
  propertyId: string,
  dto: CreateReviewDto,
) {
  // Check property exists
  const property = await this.prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new NotFoundException('Property not found');
  }

  // Prevent duplicate review
  const existingReview = await this.prisma.review.findFirst({
    where: {
      propertyId,
      userId,
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this property.');
  }

  // Create review
  return this.prisma.review.create({
    data: {
      rating: dto.rating,
      comment: dto.comment,
      propertyId,
      userId,
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

  // Get Reviews of a Property
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
  // Rating Statistics
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
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    };
  }

  const totalRating = reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  );

  return {
    averageRating: Number((totalRating / totalReviews).toFixed(1)),
    totalReviews,
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    threeStar: reviews.filter(r => r.rating === 3).length,
    twoStar: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
  };
}
  // Update Review
  async update(
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto,
  ) {}

  // Delete Review
  async remove(reviewId: string, userId: string) {}
}