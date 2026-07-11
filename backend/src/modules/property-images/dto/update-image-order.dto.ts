import {
  ApiProperty,
} from '@nestjs/swagger';

import {
  IsNumber,
} from 'class-validator';

export class UpdateImageOrderDto {
  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  displayOrder!: number;
}