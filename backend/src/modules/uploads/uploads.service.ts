import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { ImageFileValidator } from '../../common/validators/image-file.validator';
import {
  generateFileName,
} from '../../common/utils/file.util';

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

    const validator = new ImageFileValidator();

    if (!validator.isValid(file)) {
      throw new BadRequestException(
        validator.buildErrorMessage(),
      );
    }

    return {
      originalName: file.originalname,
      filename: file.filename ?? generateFileName(file.originalname),
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    };
  }
}