import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { ImageFileValidator } from '../../common/validators/image-file.validator';
import { FirebaseService } from '../../firebase/firebase.service';


@Injectable()
export class UploadsService {

 constructor(
    private readonly firebaseService: FirebaseService,
  ) {}


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

    const uploadResult =
  await this.firebaseService.uploadImage(file);

return {
  success: true,
  imageUrl: uploadResult.imageUrl,
  filename: uploadResult.fileName,
  originalName: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
};
  }
}