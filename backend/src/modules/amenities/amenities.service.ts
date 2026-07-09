import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AmenitiesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(name: string) {
    const existingAmenity =
      await this.prisma.amenity.findUnique({
        where: {
          name,
        },
      });

    if (existingAmenity) {
      throw new BadRequestException(
        'Amenity already exists.',
      );
    }

    const amenity =
      await this.prisma.amenity.create({
        data: {
          name,
        },
      });

    return {
      success: true,
      message: 'Amenity created successfully.',
      amenity,
    };
  }

  async findAll() {
    const amenities =
      await this.prisma.amenity.findMany({
        orderBy: {
          name: 'asc',
        },
      });

    return {
      success: true,
      amenities,
    };
  }

  async findOne(id: string) {
    const amenity =
      await this.prisma.amenity.findUnique({
        where: {
          id,
        },
      });

    if (!amenity) {
      throw new NotFoundException(
        'Amenity not found.',
      );
    }

    return {
      success: true,
      amenity,
    };
  }

  async update(
    id: string,
    name: string,
  ) {
    const amenity =
      await this.prisma.amenity.findUnique({
        where: {
          id,
        },
      });

    if (!amenity) {
      throw new NotFoundException(
        'Amenity not found.',
      );
    }

    const updatedAmenity =
      await this.prisma.amenity.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

    return {
      success: true,
      message: 'Amenity updated successfully.',
      amenity: updatedAmenity,
    };
  }

  async remove(id: string) {
    const amenity =
      await this.prisma.amenity.findUnique({
        where: {
          id,
        },
      });

    if (!amenity) {
      throw new NotFoundException(
        'Amenity not found.',
      );
    }

    await this.prisma.amenity.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: 'Amenity deleted successfully.',
    };
  }
}