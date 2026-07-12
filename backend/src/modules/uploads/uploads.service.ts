import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { ImageFileValidator } from '../../common/validators/image-file.validator';

@Injectable()
export class UploadsService {
  async uploadImage(
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded',
      );
    }

    const validator =
      new ImageFileValidator();

    if (!validator.isValid(file)) {
      throw new BadRequestException(
        validator.buildErrorMessage(),
      );
    }

    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;

        return {
           success: true,
            imageUrl,
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
      };
  }
}