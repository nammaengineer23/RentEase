import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({
    example: 'fCM_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: 'android',
  })
  @IsString()
  @IsNotEmpty()
  platform!: string;
}