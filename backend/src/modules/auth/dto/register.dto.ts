import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Shrikant Kumar',
  })
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    example: 'shrikant@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '+919876543210',
  })
  @IsPhoneNumber('IN')
  phone!: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
  })
  @MinLength(6)
  password!: string;
}