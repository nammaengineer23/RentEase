import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/temp',

    filename: (req, file, cb) => {
      const uniqueName =
        `${Date.now()}-${Math.round(
          Math.random() * 1_000_000_000,
        )}${extname(file.originalname).toLowerCase()}`;

      cb(null, uniqueName);
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 10,
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          'Only JPEG, PNG and WEBP images are allowed.',
        ),
        false,
      );
    }

    cb(null, true);
  },
};