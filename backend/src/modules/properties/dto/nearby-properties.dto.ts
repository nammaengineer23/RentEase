import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class NearbyPropertiesDto {
  @ApiPropertyOptional({
    example: 12.9116,
  })
  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @ApiPropertyOptional({
    example: 77.6474,
  })
  @Type(() => Number)
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional({
    example: 5,
    default: 5,
    description: 'Radius in KM',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  radius?: number = 5;
}