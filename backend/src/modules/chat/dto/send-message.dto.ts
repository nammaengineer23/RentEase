import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    example: 'Hello, is this property still available?',
  })
  @IsString()
  @IsNotEmpty()
  text!: string;
}