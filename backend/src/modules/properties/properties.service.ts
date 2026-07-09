import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import { Prisma, UserRole } from '@prisma/client';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

 // ===========================
// Create Property
// ===========================

async create(
  createPropertyDto: CreatePropertyDto,
  user: any,
) {
  const {
    amenityIds,
    ...propertyData
  } = createPropertyDto;

  const property =
    await this.prisma.property.create({
      data: {
        ...propertyData,

        ownerId: user.id,

        amenities: amenityIds?.length
          ? {
              create: amenityIds.map(
                (amenityId) => ({
                  amenity: {
                    connect: {
                      id: amenityId,
                    },
                  },
                }),
              ),
            }
          : undefined,
      },

      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },

        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });

  return {
    success: true,
    message: 'Property created successfully.',
    property,
  };
}

  // ===========================
  // Get All Properties
  // ===========================

  async findAll(filterDto: FilterPropertyDto) {
    const {
      page = '1',
      limit = '10',
      search,
      city,
      locality,
      pincode,
      propertyType,
      furnishing,
      bedrooms,
      bathrooms,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      parking,
      petFriendly,
      isAvailable,
      sortBy = 'createdAt',
      order = 'desc',
    } = filterDto;

    const where: Prisma.PropertyWhereInput = {};

    // Search
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          locality: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Location
    if (city) where.city = city;

    if (locality) where.locality = locality;

    if (pincode) where.pincode = pincode;

    // Property
    if (propertyType)
      where.propertyType = propertyType;

    if (furnishing)
      where.furnishing = furnishing;

    if (bedrooms)
      where.bedrooms = Number(bedrooms);

    if (bathrooms)
      where.bathrooms = Number(bathrooms);

    // Price
    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice)
        where.price.gte = new Prisma.Decimal(
          minPrice,
        );

      if (maxPrice)
        where.price.lte = new Prisma.Decimal(
          maxPrice,
        );
    }

    // Area
    if (minArea || maxArea) {
      where.area = {};

      if (minArea)
        where.area.gte = Number(minArea);

      if (maxArea)
        where.area.lte = Number(maxArea);
    }

    // Features
    if (parking !== undefined)
      where.parking = parking === 'true';

    if (petFriendly !== undefined)
      where.petFriendly =
        petFriendly === 'true';

    if (isAvailable !== undefined)
      where.isAvailable =
        isAvailable === 'true';

    const skip =
      (Number(page) - 1) * Number(limit);

    const [properties, total] =
      await this.prisma.$transaction([
        this.prisma.property.findMany({
          where,

          include: {
            owner: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },

          orderBy: {
            [sortBy]: order,
          },

          skip,

          take: Number(limit),
        }),

        this.prisma.property.count({
          where,
        }),
      ]);

    return {
      success: true,

      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(
          total / Number(limit),
        ),
      },

      properties,
    };
  }

  // ===========================
  // Get Property By Id
  // ===========================

  async findOne(id: string) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id,
        },

        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
        },
      });

    if (!property) {
      throw new NotFoundException(
        'Property not found.',
      );
    }

    return {
      success: true,
      property,
    };
  }

  // ===========================
  // Update Property
  // ===========================

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    user: any,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: { id },
      });

    if (!property) {
      throw new NotFoundException(
        'Property not found.',
      );
    }

    if (
      property.ownerId !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this property.',
      );
    }

    const updatedProperty =
      await this.prisma.property.update({
        where: { id },

        data: updatePropertyDto,
      });

    return {
      success: true,
      message: 'Property updated successfully.',
      property: updatedProperty,
    };
  }

  // ===========================
  // Delete Property
  // ===========================

  async remove(
    id: string,
    user: any,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: { id },
      });

    if (!property) {
      throw new NotFoundException(
        'Property not found.',
      );
    }

    if (
      property.ownerId !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this property.',
      );
    }

    await this.prisma.property.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Property deleted successfully.',
    };
  }
}