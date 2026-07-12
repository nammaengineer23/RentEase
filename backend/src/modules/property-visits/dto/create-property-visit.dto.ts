import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePropertyVisitDto {
  @ApiProperty({
    example: 'cmf3ab12cd34ef56gh78ij90',
    description: 'Property ID',
  })
  @IsNotEmpty()
  @IsString()
  propertyId!: string;

  @ApiProperty({
    example: '2026-07-20T10:30:00.000Z',
    description: 'Preferred visit date and time',
  })
  @IsDateString()
  visitDate!: string;

  @ApiPropertyOptional({
    example: 'Please call me before arriving.',
    description: 'Additional notes',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}