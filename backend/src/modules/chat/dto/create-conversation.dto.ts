import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyId!: string;
}