import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Namma Engineer',
  })
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    example: 'nammaengineer23@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '+918880002304',
  })
  @IsPhoneNumber('IN')
  phone!: string;

  @ApiProperty({
    example: 'Password@123',
    minLength: 6,
  })
  @MinLength(6)
  password!: string;
}