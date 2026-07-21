import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'nammaengineer23@gmail.com',
    description:
      'Email address or phone number',
  })
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty({
    example: 'Password@123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}