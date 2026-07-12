import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import {
  VisitStatus,
  UserRole,
} from '@prisma/client';

import { CreatePropertyVisitDto } from './dto/create-property-visit.dto';
import { UpdatePropertyVisitDto } from './dto/update-property-visit.dto';

@Injectable()
export class PropertyVisitsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =====================================
  // Create Visit Request
  // =====================================

  async create(
    dto: CreatePropertyVisitDto,
    user: any,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: dto.propertyId,
        },
      });

    if (!property) {
      throw new NotFoundException(
        'Property not found.',
      );
    }

    if (!property.isAvailable) {
      throw new BadRequestException(
        'This property is not available for visits.',
      );
    }

    const visitDate = new Date(dto.visitDate);

    if (visitDate.getTime() <= Date.now()) {
      throw new BadRequestException(
        'Visit date must be in the future.',
      );
    }

    const existingVisit =
      await this.prisma.propertyVisit.findFirst({
        where: {
          propertyId: dto.propertyId,
          visitDate,
          status: {
            in: [
              VisitStatus.PENDING,
              VisitStatus.APPROVED,
            ],
          },
        },
      });

    if (existingVisit) {
      throw new BadRequestException(
        'This time slot is already booked.',
      );
    }

    const visit =
      await this.prisma.propertyVisit.create({
        data: {
          propertyId: dto.propertyId,
          tenantId: user.id,
          visitDate,
          notes: dto.notes,
        },
      });

    return {
      success: true,
      message:
        'Visit request created successfully.',
      data: visit,
    };
  }

  // =====================================
  // Owner Visits
  // =====================================

  async getOwnerVisits(user: any) {
    return this.prisma.propertyVisit.findMany({
      where: {
        property: {
          ownerId: user.id,
        },
      },

      include: {
        property: true,
        tenant: true,
      },

      orderBy: {
        visitDate: 'asc',
      },
    });
  }

  // =====================================
  // Get All
  // =====================================

  async findAll() {
    return this.prisma.propertyVisit.findMany({
      include: {
        property: true,
        tenant: true,
      },
      orderBy: {
        visitDate: 'asc',
      },
    });
  }

  // =====================================
  // Get One
  // =====================================

  async findOne(id: string) {
    const visit =
      await this.prisma.propertyVisit.findUnique({
        where: {
          id,
        },
        include: {
          property: true,
          tenant: true,
        },
      });

    if (!visit) {
      throw new NotFoundException(
        'Visit not found.',
      );
    }

    return visit;
  }

  // =====================================
  // Approve
  // =====================================

  async approveVisit(
    id: string,
    user: any,
  ) {
    const visit =
      await this.findOne(id);

    if (
      visit.property.ownerId !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Access denied.',
      );
    }

    return this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.APPROVED,
      },
    });
  }

  // =====================================
  // Reject
  // =====================================

  async rejectVisit(
    id: string,
    user: any,
  ) {
    const visit =
      await this.findOne(id);

    if (
      visit.property.ownerId !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Access denied.',
      );
    }

    return this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.REJECTED,
      },
    });
  }

  // =====================================
  // Complete
  // =====================================

  async completeVisit(
    id: string,
    user: any,
  ) {
    const visit =
      await this.findOne(id);

    if (
      visit.property.ownerId !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Access denied.',
      );
    }

    return this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.COMPLETED,
      },
    });
  }

  // =====================================
  // Cancel
  // =====================================

  async cancelVisit(
    id: string,
    user: any,
  ) {
    const visit =
      await this.findOne(id);

    if (
      visit.tenantId !== user.id &&
      visit.property.ownerId !== user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Access denied.',
      );
    }

    return this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.CANCELLED,
      },
    });
  }

  // =====================================
  // Update
  // =====================================

  async update(
    id: string,
    dto: UpdatePropertyVisitDto,
  ) {
    await this.findOne(id);

    return this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        ...(dto.visitDate && {
          visitDate: new Date(dto.visitDate),
        }),
        ...(dto.notes !== undefined && {
          notes: dto.notes,
        }),
      },
    });
  }

  // =====================================
  // Delete
  // =====================================

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.propertyVisit.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message:
        'Visit deleted successfully.',
    };
  }
}