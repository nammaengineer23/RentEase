import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class UpdatePropertyAmenitiesDto {
  @ApiProperty({
    example: [
      'cmrua1zce0000v5lwl5p0fbf5',
      'cmrua2abc0001v5lwxyz12345',
    ],
    description: 'Amenity IDs',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  amenityIds!: string[];
}