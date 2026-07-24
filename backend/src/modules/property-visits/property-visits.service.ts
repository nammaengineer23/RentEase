import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { VisitStatus, UserRole } from '@prisma/client';

import { CreatePropertyVisitDto } from './dto/create-property-visit.dto';
import { UpdatePropertyVisitDto } from './dto/update-property-visit.dto';
import { MailService } from '../../mail/mail.service';
import { serializePrisma } from '../../common/utils/prisma-response.util';
import { NotificationsService } from '../notifications/notifications.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { NotificationType } from '@prisma/client';
@Injectable()
export class PropertyVisitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  // =====================================
  // Create Visit Request
  // =====================================

  async create(dto: CreatePropertyVisitDto, user: any) {
    const property = await this.prisma.property.findUnique({
      where: {
        id: dto.propertyId,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found.');
    }

    if (!property.isAvailable) {
      throw new BadRequestException(
        'This property is not available for visits.',
      );
    }

    const visitDate = new Date(dto.visitDate);

    if (visitDate.getTime() <= Date.now()) {
      throw new BadRequestException('Visit date must be in the future.');
    }

    const existingVisit = await this.prisma.propertyVisit.findFirst({
      where: {
        propertyId: dto.propertyId,
        visitDate,
        status: {
          in: [VisitStatus.PENDING, VisitStatus.APPROVED],
        },
      },
    });

    if (existingVisit) {
      throw new BadRequestException('This time slot is already booked.');
    }

    const visit = await this.prisma.propertyVisit.create({
      data: {
        propertyId: dto.propertyId,
        tenantId: user.id,
        visitDate,
        notes: dto.notes,
      },

      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        },

        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // ==========================
    // Email Notification
    // ==========================

    /*  await this.mailService.sendVisitRequestEmail(
    visit.property.owner.email,
    {
      ownerName: visit.property.owner.fullName,
      tenantName: visit.tenant.fullName,
      propertyTitle: visit.property.title,
      visitDate: visit.visitDate,
    },
  );
*/
    // ==========================
    // In-App Notification
    // ==========================

    await this.notificationsService.createNotification(
      visit.property.owner.id,
      'New Visit Request',
      `${visit.tenant.fullName} requested a property visit.`,
      NotificationType.VISIT_REQUEST,
    );

    // ==========================
    // Push Notification (FCM)
    // ==========================

    await this.pushNotificationsService.sendToUser(
      visit.property.owner.id,
      'New Visit Request',
      `${visit.tenant.fullName} requested a property visit for "${visit.property.title}".`,
      {
        type: 'VISIT_REQUEST',
        propertyId: visit.property.id,
        visitId: visit.id,
      },
    );

    return {
      success: true,
      message: 'Visit booked successfully.',
      data: visit,
    };
  }

  // =====================================
  // Owner Visits
  // =====================================

  async getOwnerVisits(user: any) {
    const visits = await this.prisma.propertyVisit.findMany({
      where: {
        property: {
          ownerId: user.id,
        },
      },

      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        },

        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },

      orderBy: {
        visitDate: 'asc',
      },
    });

    return {
      success: true,
      total: visits.length,
      visits: serializePrisma(visits),
    };
  }

  // =====================================
  // Get All
  // =====================================

  async findAll() {
    const visits = await this.prisma.propertyVisit.findMany({
      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        },

        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },

      orderBy: {
        visitDate: 'asc',
      },
    });

    return {
      success: true,
      total: visits.length,
      visits: serializePrisma(visits),
    };
  }

  // =====================================
  // Get One
  // =====================================

  async findOne(id: string) {
    const visit = await this.prisma.propertyVisit.findUnique({
      where: {
        id,
      },

      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        },

        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found.');
    }

    return serializePrisma(visit);
  }

  // =====================================
  // Approve
  // =====================================

  // =====================================
  // Approve
  // =====================================

  async approveVisit(id: string, user: any) {
    const visit = await this.findOne(id);

    if (visit.property.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied.');
    }

    const updatedVisit = await this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.APPROVED,
      },
      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    try {
      await this.mailService.sendVisitApprovalEmail(
        updatedVisit.tenant.email,
        updatedVisit.tenant.fullName,
        updatedVisit.property.title,
        updatedVisit.visitDate.toLocaleString(),
      );
    } catch (error) {
      console.error(error);
    }

    // ==========================
    // In-App Notification
    // ==========================

    await this.notificationsService.createNotification(
      updatedVisit.tenant.id,
      'Visit Approved',
      'Your property visit has been approved.',
      NotificationType.VISIT_APPROVED,
    );

    // ==========================
    // Push Notification (FCM)
    // ==========================

    await this.pushNotificationsService.sendToUser(
      updatedVisit.tenant.id,
      'Visit Approved',
      `Your visit for "${updatedVisit.property.title}" has been approved.`,
      {
        type: 'VISIT_APPROVED',
        propertyId: updatedVisit.property.id,
        visitId: updatedVisit.id,
      },
    );

    return {
      success: true,
      message: 'Visit approved successfully.',
      data: serializePrisma(updatedVisit),
    };
  }
  // =====================================
  // Reject
  // =====================================

  // =====================================
  // Reject
  // =====================================

  async rejectVisit(id: string, user: any) {
    const visit = await this.findOne(id);

    if (visit.property.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied.');
    }

    const updatedVisit = await this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.REJECTED,
      },
      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // ==========================
    // Email
    // ==========================

    try {
      await this.mailService.sendVisitRejectedEmail(
        updatedVisit.tenant.email,
        updatedVisit.tenant.fullName,
        updatedVisit.property.title,
      );
    } catch (error) {
      console.error(error);
    }

    // ==========================
    // In-App Notification
    // ==========================

    await this.notificationsService.createNotification(
      updatedVisit.tenant.id,
      'Visit Rejected',
      `Your visit for "${updatedVisit.property.title}" has been rejected.`,
      NotificationType.VISIT_REJECTED,
    );

    // ==========================
    // Push Notification (FCM)
    // ==========================

    await this.pushNotificationsService.sendToUser(
      updatedVisit.tenant.id,
      'Visit Rejected',
      `Your visit for "${updatedVisit.property.title}" has been rejected.`,
      {
        type: 'VISIT_REJECTED',
        propertyId: updatedVisit.property.id,
        visitId: updatedVisit.id,
      },
    );

    return {
      success: true,
      message: 'Visit rejected successfully.',
      data: serializePrisma(updatedVisit),
    };
  }
  // =====================================
  // Complete
  // =====================================

  // =====================================
  // Complete
  // =====================================

  async completeVisit(id: string, user: any) {
    const visit = await this.findOne(id);

    if (visit.property.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied.');
    }

    const updatedVisit = await this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.COMPLETED,
      },
      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // ==========================
    // Email
    // ==========================

    try {
      await this.mailService.sendVisitCompletedEmail(
        updatedVisit.tenant.email,
        updatedVisit.tenant.fullName,
        updatedVisit.property.title,
      );
    } catch (error) {
      console.error(error);
    }

    // ==========================
    // In-App Notification
    // ==========================

    await this.notificationsService.createNotification(
      updatedVisit.tenant.id,
      'Visit Completed',
      `Your visit for "${updatedVisit.property.title}" has been marked as completed.`,
      NotificationType.VISIT_COMPLETED,
    );

    // ==========================
    // Push Notification (FCM)
    // ==========================

    await this.pushNotificationsService.sendToUser(
      updatedVisit.tenant.id,
      'Visit Completed',
      `Your visit for "${updatedVisit.property.title}" has been completed.`,
      {
        type: 'VISIT_COMPLETED',
        propertyId: updatedVisit.property.id,
        visitId: updatedVisit.id,
      },
    );

    return {
      success: true,
      message: 'Visit completed successfully.',
      data: serializePrisma(updatedVisit),
    };
  }

  // =====================================
  // Cancel
  // =====================================

  // =====================================
  // Cancel
  // =====================================

  async cancelVisit(id: string, user: any) {
    const visit = await this.findOne(id);

    const isOwner = visit.property.ownerId === user.id;

    const isTenant = visit.tenantId === user.id;

    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isTenant && !isAdmin) {
      throw new ForbiddenException('Access denied.');
    }

    const updatedVisit = await this.prisma.propertyVisit.update({
      where: {
        id,
      },
      data: {
        status: VisitStatus.CANCELLED,
      },
      include: {
        property: {
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
              where: {
                isPrimary: true,
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // =====================================
    // Email
    // =====================================

    try {
      if (isTenant) {
        await this.mailService.sendVisitCancelledEmail(
          updatedVisit.property.owner.email,
          updatedVisit.property.owner.fullName,
          updatedVisit.property.title,
        );
      } else {
        await this.mailService.sendVisitCancelledEmail(
          updatedVisit.tenant.email,
          updatedVisit.tenant.fullName,
          updatedVisit.property.title,
        );
      }
    } catch (error) {
      console.error(error);
    }

    // =====================================
    // In-App Notification
    // =====================================

    const receiverId = isTenant
      ? updatedVisit.property.owner.id
      : updatedVisit.tenant.id;

    const title = 'Visit Cancelled';

    const message = isTenant
      ? `${updatedVisit.tenant.fullName} cancelled the visit for "${updatedVisit.property.title}".`
      : `Your visit for "${updatedVisit.property.title}" has been cancelled.`;

    await this.notificationsService.createNotification(
      receiverId,
      title,
      message,
      NotificationType.VISIT_CANCELLED,
    );

    // =====================================
    // Push Notification (FCM)
    // =====================================

    await this.pushNotificationsService.sendToUser(receiverId, title, message, {
      type: 'VISIT_CANCELLED',
      propertyId: updatedVisit.property.id,
      visitId: updatedVisit.id,
    });

    return {
      success: true,
      message: 'Visit cancelled successfully.',
      data: serializePrisma(updatedVisit),
    };
  }

  // =====================================
  // Update
  // =====================================

  async update(id: string, dto: UpdatePropertyVisitDto) {
    await this.findOne(id);

    const updatedVisit = await this.prisma.propertyVisit.update({
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
      include: {
        property: true,
        tenant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Visit updated successfully.',
      data: serializePrisma(updatedVisit),
    };
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
      message: 'Visit deleted successfully.',
    };
  }
}
