import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPassword@123',
  })
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty({
    example: 'NewPassword@123',
  })
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;
}