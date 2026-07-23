import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({
    example: 'fCM_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: 'android',
    required: false,
  })
  @IsOptional()
  @IsString()
  platform?: string;
}