import { extname } from 'path';

export function getFileExtension(filename: string): string {
  return extname(filename).toLowerCase();
}

export function generateFileName(filename: string): string {
  const extension = getFileExtension(filename);

  const timestamp = Date.now();

  return `${timestamp}-${Math.round(
    Math.random() * 1e9,
  )}${extension}`;
}

export function isImageFile(filename: string): boolean {
  const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
  ];

  return allowedExtensions.includes(
    getFileExtension(filename),
  );
}