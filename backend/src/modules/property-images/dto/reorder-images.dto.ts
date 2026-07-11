import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class ImageOrderDto {
  @ApiProperty({
    example: 'cmc123456789',
  })
  @IsString()
  imageId!: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  displayOrder!: number;
}

export class ReorderImagesDto {
  @ApiProperty({
    type: [ImageOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageOrderDto)
  images!: ImageOrderDto[];
}