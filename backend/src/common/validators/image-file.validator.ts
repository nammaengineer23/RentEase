import {
  FileValidator,
} from '@nestjs/common';

export class ImageFileValidator extends FileValidator {
  constructor(
    private readonly maxSize: number = 5 * 1024 * 1024,
  ) {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    return (
      allowedTypes.includes(file.mimetype) &&
      file.size <= this.maxSize
    );
  }

  buildErrorMessage(): string {
return 'Invalid image file. Only JPG, JPEG, PNG, WEBP and GIF files under 5MB are allowed.';  }
}