import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    example: 'NewPassword@123',
  })
  @MinLength(8)
  password!: string;
}