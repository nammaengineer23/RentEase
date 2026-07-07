import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
    example: 'password123',
    minLength: 6,
  })
  @MinLength(6)
  password!: string;
}