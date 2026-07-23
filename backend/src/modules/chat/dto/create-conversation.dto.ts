import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    example: 'cmrpyufqv0003v5600z6q2cm6',
    description: 'Property ID',
  })
  @IsString()
  @IsNotEmpty()
  propertyId!: string;
}