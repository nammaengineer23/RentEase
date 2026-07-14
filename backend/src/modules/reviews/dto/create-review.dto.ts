import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    default: 5,
    minimum: 1,
    maximum: 5,
    description: 'Rating between 1 and 5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({
    example: 'Very clean property and friendly owner.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}