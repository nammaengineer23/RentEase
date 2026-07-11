import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import {
  diskStorage,
} from 'multer';

import {
  extname,
} from 'path';

import {
  UploadsService,
} from './uploads.service';

import {
  generateFileName,
} from '../../common/utils/file.util';


@Controller('uploads')
export class UploadsController {

  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (
            req,
            file,
            callback,
          ) => {
            const filename =
              generateFileName(
                file.originalname,
              );

            callback(
              null,
              filename,
            );
          },
        }),
        limits: {
          fileSize:
            5 * 1024 * 1024, // 5MB
        },
        fileFilter: (
          req,
          file,
          callback,
        ) => {
          const allowedExtensions =
            [
              '.jpg',
              '.jpeg',
              '.png',
              '.webp',
            ];

          const extension =
            extname(
              file.originalname,
            ).toLowerCase();

          if (
            allowedExtensions.includes(
              extension,
            )
          ) {
            callback(
              null,
              true,
            );
          } else {
            callback(
              new Error(
                'Only JPG, JPEG, PNG and WEBP files are allowed',
              ),
              false,
            );
          }
        },
      },
    ),
  )
  async uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadImage(
      file,
    );
  }
}