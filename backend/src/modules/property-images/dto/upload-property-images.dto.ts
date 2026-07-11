import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class UploadPropertyImagesDto {
  @ApiProperty({
    type: [String],
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    description: 'Array of uploaded image URLs',
  })
  @IsArray()
  @IsString({ each: true })
  imageUrls!: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Make first image primary',
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}