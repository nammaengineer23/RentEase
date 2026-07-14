import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OwnerDashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================
  // Dashboard Summary
  // ==========================
  async getDashboard(ownerId: string) {
    const properties = await this.prisma.property.findMany({
      where: {
        ownerId,
      },
      include: {
        favorites: true,
        visits: true,
        reviews: true,
      },
    });

    const totalProperties = properties.length;

    const availableProperties = properties.filter(
      (p) => p.isAvailable,
    ).length;

    const rentedProperties =
      totalProperties - availableProperties;

    const totalFavorites = properties.reduce(
      (sum, property) => sum + property.favorites.length,
      0,
    );

    const totalVisits = properties.reduce(
      (sum, property) => sum + property.visits.length,
      0,
    );

    const pendingVisits = properties.reduce(
      (sum, property) =>
        sum +
        property.visits.filter(
          (v) => v.status === 'PENDING',
        ).length,
      0,
    );

    const completedVisits = properties.reduce(
      (sum, property) =>
        sum +
        property.visits.filter(
          (v) => v.status === 'COMPLETED',
        ).length,
      0,
    );

    const allReviews = properties.flatMap(
      (property) => property.reviews,
    );

    const totalReviews = allReviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              allReviews.reduce(
                (sum, review) => sum + review.rating,
                0,
              ) / totalReviews
            ).toFixed(1),
          );

    return {
      totalProperties,
      availableProperties,
      rentedProperties,
      totalFavorites,
      totalVisits,
      pendingVisits,
      completedVisits,
      averageRating,
      totalReviews,
    };
  }

  // ==========================
  // Owner Properties
  // ==========================
  async getMyProperties(ownerId: string) {
    const properties = await this.prisma.property.findMany({
      where: {
        ownerId,
      },
      include: {
        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
        },
        favorites: true,
        visits: true,
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return properties.map((property) => {
      const pendingVisits = property.visits.filter(
        (visit) => visit.status === 'PENDING',
      ).length;

      const completedVisits = property.visits.filter(
        (visit) => visit.status === 'COMPLETED',
      ).length;

      const totalReviews = property.reviews.length;

      const averageRating =
        totalReviews === 0
          ? 0
          : Number(
              (
                property.reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0,
                ) / totalReviews
              ).toFixed(1),
            );

      return {
        id: property.id,
        title: property.title,
        city: property.city,
        locality: property.locality,
        price: property.price,
        isAvailable: property.isAvailable,

        averageRating,
        totalReviews,

        totalFavorites: property.favorites.length,

        pendingVisits,
        completedVisits,

        primaryImage:
          property.images.length > 0
            ? property.images[0].imageUrl
            : null,

        createdAt: property.createdAt,
      };
    });
  }
}