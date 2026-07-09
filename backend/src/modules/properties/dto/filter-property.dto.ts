import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  FurnishingType,
  PropertyType,
} from '@prisma/client';

export class FilterPropertyDto {
  // Pagination

  @ApiPropertyOptional({
    default: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    default: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  // Search

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  // Location

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locality?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pincode?: string;

  // Property

  @ApiPropertyOptional({
    enum: PropertyType,
  })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @ApiPropertyOptional({
    enum: FurnishingType,
  })
  @IsOptional()
  @IsEnum(FurnishingType)
  furnishing?: FurnishingType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  bedrooms?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  bathrooms?: string;

  // Price

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  // Area

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  minArea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  maxArea?: string;

  // Features

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  parking?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  petFriendly?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  isAvailable?: string;

  // Sorting

  @ApiPropertyOptional({
    example: 'price',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';
}