import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty({
    example: 'VISIT',
  })
  type!: string;

  @ApiProperty({
    example: 'Rahul requested a property visit',
  })
  title!: string;

  @ApiProperty({
    example: '2 BHK Apartment',
  })
  property!: string;

  @ApiProperty({
    example: 'PENDING',
  })
  status!: string;

  @ApiProperty({
    example: '2026-07-14T10:30:00.000Z',
  })
  createdAt!: Date;
}