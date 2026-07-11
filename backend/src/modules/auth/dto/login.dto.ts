import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'shrikant@example.com',
    description:
      'Email address or phone number',
  })
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}