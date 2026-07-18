import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { FirebaseLoginDto } from './dto/firebase-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

@Post('firebase-login')
@ApiOperation({
  summary: 'Login using Firebase Phone Authentication',
})
firebaseLogin(
  @Body() dto: FirebaseLoginDto,
) {
  return this.authService.firebaseLogin(
    dto.idToken,
  );
}

@Post('refresh')
@ApiOperation({
  summary: 'Refresh Access Token',
})
refresh(
  @Body() dto: RefreshTokenDto,
) {
  return this.authService.refreshToken(
    dto.refreshToken,
  );
}

// =====================================
// Forgot Password
// =====================================

@Post('forgot-password')
@ApiOperation({
  summary: 'Send password reset email',
})
forgotPassword(
  @Body()
  dto: ForgotPasswordDto,
) {
  return this.authService.forgotPassword(
    dto,
  );
}

// =====================================
// Reset Password
// =====================================

@Post('reset-password')
@ApiOperation({
  summary: 'Reset password',
})
resetPassword(
  @Body()
  dto: ResetPasswordDto,
) {
  return this.authService.resetPassword(
    dto,
  );
}

 @Get('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({
  summary: 'Get current user',
})
getCurrentUser(@Request() req: any) {
  return req.user;
}
}