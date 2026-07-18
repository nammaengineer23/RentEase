import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import { Prisma, UserRole } from '@prisma/client';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilterPropertiesDto } from './dto/filter-property.dto';

@Injectable()
export class PropertiesService {
  constructor( 
    private readonly prisma: PrismaService,
    ) {}
   private serializeProperty(property: any) {
  return {
    ...property,

    price:
      property.price != null
        ? Number(property.price)
        : null,

    securityDeposit:
      property.securityDeposit != null
        ? Number(property.securityDeposit)
        : null,

    latitude:
      property.latitude != null
        ? Number(property.latitude)
        : null,

    longitude:
      property.longitude != null
        ? Number(property.longitude)
        : null,
  };
}
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

          images: true,
        },
      });

    return {
      success: true,
      message: 'Property created successfully.',
      property: this.serializeProperty(property),
    };
  }

private buildPropertyWhere(
  filterDto: FilterPropertiesDto,
): Prisma.PropertyWhereInput {
  const {
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
        city: {
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
  if (city) {
    where.city = {
      contains: city,
      mode: 'insensitive',
    };
  }

  if (locality) {
    where.locality = {
      contains: locality,
      mode: 'insensitive',
    };
  }

  if (pincode) {
    where.pincode = pincode;
  }

  // Property details
  if (propertyType) {
    where.propertyType = propertyType;
  }

  if (furnishing) {
    where.furnishing = furnishing;
  }

  if (bedrooms !== undefined) {
    where.bedrooms = bedrooms;
  }

  if (bathrooms !== undefined) {
    where.bathrooms = bathrooms;
  }

  // Price
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  // Area
  if (minArea !== undefined || maxArea !== undefined) {
    where.area = {};

    if (minArea !== undefined) {
      where.area.gte = minArea;
    }

    if (maxArea !== undefined) {
      where.area.lte = maxArea;
    }
  }

  // Boolean filters
  if (parking !== undefined) {
    where.parking = parking;
  }

  if (petFriendly !== undefined) {
    where.petFriendly = petFriendly;
  }

  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable;
  }

  return where;
}

  // ===========================
// Get All Properties
// ===========================

async findAll(filterDto: FilterPropertiesDto) {
 
  const {
    page = 1,
    limit = 10,
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

 
const where = this.buildPropertyWhere(filterDto);

  // -----------------------
  // Search
  // -----------------------

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        city: {
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

  // -----------------------
  // Location
  // -----------------------

  if (city) {
    where.city = {
      contains: city,
      mode: 'insensitive',
    };
  }

  if (locality) {
    where.locality = {
      contains: locality,
      mode: 'insensitive',
    };
  }

  if (pincode) {
    where.pincode = pincode;
  }

  // -----------------------
  // Property Details
  // -----------------------

  if (propertyType) {
    where.propertyType = propertyType;
  }

  if (furnishing) {
    where.furnishing = furnishing;
  }

  if (bedrooms !== undefined) {
    where.bedrooms = bedrooms;
  }

  if (bathrooms !== undefined) {
    where.bathrooms = bathrooms;
  }

  // -----------------------
  // Price
  // -----------------------

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  // -----------------------
  // Area
  // -----------------------

  if (minArea !== undefined || maxArea !== undefined) {
    where.area = {};

    if (minArea !== undefined) {
      where.area.gte = minArea;
    }

    if (maxArea !== undefined) {
      where.area.lte = maxArea;
    }
  }

  // -----------------------
  // Booleans
  // -----------------------

  if (parking !== undefined) {
    where.parking = parking;
  }

  if (petFriendly !== undefined) {
    where.petFriendly = petFriendly;
  }

  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable;
  }
  

 
  // -----------------------
  // Pagination
  // -----------------------

  const skip = (page - 1) * limit;
  
  const [properties, total] = await this.prisma.$transaction([
    this.prisma.property.findMany({
      where,

      skip,

      take: limit,

      orderBy: {
        [sortBy]: order,
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

        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },

        amenities: {
          include: {
            amenity: true,
          },
        },

        favorites: true,

        reviews: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    }),

    this.prisma.property.count({
      where,
    }),
  ]);

  // -----------------------
  // Average Rating
  // -----------------------

const data = properties.map((property) => {
  const totalRating = property.reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  );

  const averageRating =
    property.reviews.length > 0
      ? Number((totalRating / property.reviews.length).toFixed(1))
      : 0;

  return {
    ...this.serializeProperty(property),
    averageRating,
    totalReviews: property.reviews.length,
  };
});

  return {
    success: true,

    data,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ===========================
// Owner - My Properties
// ===========================

async findMyProperties(user: any) {
  const properties = await this.prisma.property.findMany({
    where: {
      ownerId: user.id,
    },

    orderBy: {
      createdAt: 'desc',
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

      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },

      amenities: {
        include: {
          amenity: true,
        },
      },

      favorites: true,

      reviews: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      },
    },
  });

  const data = properties.map((property) => {
    const totalRating = property.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    const averageRating =
      property.reviews.length > 0
        ? Number(
            (
              totalRating /
              property.reviews.length
            ).toFixed(1),
          )
        : 0;

    return {
      ...this.serializeProperty(property),
      averageRating,
      totalReviews: property.reviews.length,
    };
  });

  return {
    success: true,
    total: data.length,
    data,
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

          amenities: {
            include: {
              amenity: true,
            },
          },

          images: {
            orderBy: {
              displayOrder: 'asc',
            },
          },

          _count: {
            select: {
              favorites: true,
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
      property: this.serializeProperty(property),
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
        where: {
          id,
        },

        include: {
          amenities: true,
        },
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

    const {
      amenityIds,
      ...propertyData
    } = updatePropertyDto;

    const updatedProperty =
      await this.prisma.property.update({
        where: {
          id,
        },

        data: {
          ...propertyData,

          amenities:
            amenityIds !== undefined
              ? {
                  deleteMany: {},

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

          images: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
        },
      });

    return {
      success: true,
      message:
        'Property updated successfully.',
      property: this.serializeProperty(updatedProperty),
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
        where: {
          id,
        },
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
      where: {
        id,
      },
    });

    return {
      success: true,
      message:
        'Property deleted successfully.',
    };
  }
  

}