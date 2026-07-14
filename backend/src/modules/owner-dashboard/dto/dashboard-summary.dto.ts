import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty()
  totalProperties!: number;

  @ApiProperty()
  availableProperties!: number;

  @ApiProperty()
  rentedProperties!: number;

  @ApiProperty()
  totalFavorites!: number;

  @ApiProperty()
  totalVisits!: number;

  @ApiProperty()
  pendingVisits!: number;

  @ApiProperty()
  completedVisits!: number;

  @ApiProperty()
  averageRating!: number;

  @ApiProperty()
  totalReviews!: number;
}