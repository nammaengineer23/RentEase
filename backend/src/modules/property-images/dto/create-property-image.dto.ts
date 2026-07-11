import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePropertyImageDto {
  @ApiProperty({
    example:
      '/uploads/abc123.jpg',
  })
  @IsString()
  imageUrl!: string;

  @ApiProperty({
    required: false,
    example:
      'property-images/abc123',
  })
  @IsOptional()
  @IsString()
  publicId?: string;
}