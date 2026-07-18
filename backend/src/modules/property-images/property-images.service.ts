import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRole } from '@prisma/client';

import { PrismaService } from '../../database/prisma.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { ReorderImagesDto } from './dto/reorder-images.dto';

@Injectable()
export class PropertyImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  // =====================================
  // Upload Images
  // =====================================

  async uploadImages(
    propertyId: string,
    files: Express.Multer.File[],
    isPrimary: boolean,
    user: any,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: propertyId,
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
        'You are not allowed to upload images.',
      );
    }

    if (!files || files.length === 0) {
      throw new NotFoundException(
        'No images uploaded.',
      );
    }

    const currentCount =
      await this.prisma.propertyImage.count({
        where: {
          propertyId,
        },
      });

    const images = [];

    for (
      let index = 0;
      index < files.length;
      index++
    ) {
      const file = files[index];

      const uploadResult =
        await this.firebaseService.uploadImage(
          file,
          'properties',
        );

      const image =
        await this.prisma.propertyImage.create({
          data: {
            propertyId,
            imageUrl: uploadResult.imageUrl,
            publicId: uploadResult.publicId,
            displayOrder:
              currentCount + index,
            isPrimary:
              isPrimary && index === 0,
          },
        });

      images.push(image);
    }

    return {
      success: true,
      message:
        'Images uploaded successfully.',
      images,
    };
  }

  // =====================================
  // Get Images
  // =====================================

  async getImages(
    propertyId: string,
  ) {
    const images =
      await this.prisma.propertyImage.findMany({
        where: {
          propertyId,
        },
        orderBy: {
          displayOrder: 'asc',
        },
      });

    return {
      success: true,
      images,
    };
  }

  // =====================================
  // Set Primary Image
  // =====================================

  async setPrimary(
    propertyId: string,
    imageId: string,
    user: any,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: propertyId,
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
        'Access denied.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.propertyImage.updateMany({
        where: {
          propertyId,
        },
        data: {
          isPrimary: false,
        },
      }),

      this.prisma.propertyImage.update({
        where: {
          id: imageId,
        },
        data: {
          isPrimary: true,
        },
      }),
    ]);

    return {
      success: true,
      message:
        'Primary image updated successfully.',
    };
  }

  // =====================================
  // Reorder Images
  // =====================================

  async reorderImages(
    propertyId: string,
    dto: ReorderImagesDto,
    user: any,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: propertyId,
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
        'Access denied.',
      );
    }

    await this.prisma.$transaction(
      dto.images.map((image) =>
        this.prisma.propertyImage.update({
          where: {
            id: image.imageId,
          },
          data: {
            displayOrder:
              image.displayOrder,
          },
        }),
      ),
    );

    return {
      success: true,
      message:
        'Images reordered successfully.',
    };
  }

  // =====================================
  // Delete Image
  // =====================================

  async deleteImage(
    propertyId: string,
    imageId: string,
    user: any,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: propertyId,
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
        'Access denied.',
      );
    }

    const image =
      await this.prisma.propertyImage.findUnique({
        where: {
          id: imageId,
        },
      });

    if (!image) {
      throw new NotFoundException(
        'Image not found.',
      );
    }

    // Delete image from Firebase Storage
    if (image.publicId) {
      await this.firebaseService.deleteImage(
        image.publicId,
      );
    }

    // Delete image from database
    await this.prisma.propertyImage.delete({
      where: {
        id: imageId,
      },
    });

    // Assign another image as primary if needed
    if (image.isPrimary) {
      const nextImage =
        await this.prisma.propertyImage.findFirst({
          where: {
            propertyId,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        });

      if (nextImage) {
        await this.prisma.propertyImage.update({
          where: {
            id: nextImage.id,
          },
          data: {
            isPrimary: true,
          },
        });
      }
    }

    return {
      success: true,
      message:
        'Image deleted successfully.',
    };
  }
}