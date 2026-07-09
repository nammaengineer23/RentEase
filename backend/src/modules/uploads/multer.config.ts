import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/properties',

    filename: (req, file, cb) => {
      const filename =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        extname(file.originalname);

      cb(null, filename);
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.match(
        /\/(jpg|jpeg|png|webp)$/i,
      )
    ) {
      return cb(
        new Error('Only image files are allowed'),
        false,
      );
    }

    cb(null, true);
  },
};