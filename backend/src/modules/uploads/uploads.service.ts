import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async uploadPropertyImages(
    propertyId: string,
    files: Express.Multer.File[],
  ) {
    // Check property exists
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

    // Existing images
    const existingImages =
      await this.prisma.propertyImage.findMany({
        where: {
          propertyId,
        },
        orderBy: {
          displayOrder: 'asc',
        },
      });

    const isFirstUpload =
      existingImages.length === 0;

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const image =
        await this.prisma.propertyImage.create({
          data: {
            propertyId,

            imageUrl:
              '/uploads/properties/' +
              file.filename,

            isPrimary:
              isFirstUpload && i === 0,

            displayOrder:
              existingImages.length + i,
          },
        });

      uploadedImages.push(image);
    }

    return {
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully.`,
      images: uploadedImages,
    };
  }
}