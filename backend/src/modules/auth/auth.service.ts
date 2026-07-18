import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FirebaseService } from '../../firebase/firebase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private firebaseService: FirebaseService,
    private mailService: MailService,
  ) {}

  //---------------------------------------
  // Register
  //---------------------------------------
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        passwordHash: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    await this.saveRefreshToken(user.id, tokens.refreshToken);
    
    // ======================================
// Send Welcome Email
// ======================================

try {
  await this.mailService.sendWelcomeEmail(
    user.email,
    user.fullName,
  );
} catch (error) {
  console.error(
    'Failed to send welcome email:',
    error,
  );
}

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      ...tokens,
    };
  }

  //---------------------------------------
  // Login
  //---------------------------------------
  async login(loginDto: LoginDto) {
  const { login, password } = loginDto;
  const user = await this.prisma.user.findFirst({
  where: {
    OR: [
      {
        email: login,
      },
      {
        phone: login,
      },
    ],
  },
});

  if (!user) {
    throw new UnauthorizedException(
      'Invalid email or password.',
    );
  }

  const passwordMatched = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordMatched) {
    throw new UnauthorizedException(
      'Invalid email or password.',
    );
  }

  const tokens = await this.generateTokens(
  user.id,
  user.email,
);

await this.saveRefreshToken(
  user.id,
  tokens.refreshToken,
);

return {
  success: true,
  message: 'Login successful.',
  ...tokens,
  user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}

async firebaseLogin(idToken: string) {
  // Verify Firebase ID token
  const decoded =
    await this.firebaseService.verifyToken(idToken);

  const phone = decoded.phone_number;

  if (!phone) {
    throw new UnauthorizedException(
      'Phone number not found in Firebase token.',
    );
  }

  // Check if user already exists
  let user = await this.prisma.user.findUnique({
    where: {
      phone,
    },
  });

  // Auto-register if first login
  if (!user) {
    user = await this.prisma.user.create({
      data: {
        fullName: decoded.name ?? 'RentEase User',
        phone,
        email:
          decoded.email ??
          `${phone.replace('+', '')}@firebase.rentease.local`,
        passwordHash: '',
      },
    });
  }

  const tokens = await this.generateTokens(
    user.id,
    user.email,
  );

  await this.saveRefreshToken(
    user.id,
    tokens.refreshToken,
  );

  return {
    success: true,
    message: 'Login successful.',
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    ...tokens,
  };
}

//---------------------------------------
// Refresh Token
//---------------------------------------
async refreshToken(refreshToken: string) {
  // Decode token to get user id
  const payload = await this.jwtService.verifyAsync(refreshToken, {
    secret: process.env.JWT_REFRESH_SECRET,
  });

  // Get all refresh tokens for this user
  const storedTokens = await this.prisma.refreshToken.findMany({
    where: {
      userId: payload.sub,
    },
  });

  let matchedToken: (typeof storedTokens)[number] | null = null;

  for (const token of storedTokens) {
    const isMatch = await bcrypt.compare(
      refreshToken,
      token.token,
    );

    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    throw new UnauthorizedException(
      'Invalid refresh token.',
    );
  }

  // Check expiry
  if (matchedToken.expiresAt < new Date()) {
    await this.prisma.refreshToken.delete({
      where: {
        id: matchedToken.id,
      },
    });

    throw new UnauthorizedException(
      'Refresh token expired.',
    );
  }

  // Remove old refresh token (rotation)
  await this.prisma.refreshToken.delete({
    where: {
      id: matchedToken.id,
    },
  });

  // Generate new tokens
  const tokens = await this.generateTokens(
    payload.sub,
    payload.email,
  );

  // Save hashed refresh token
  await this.saveRefreshToken(
    payload.sub,
    tokens.refreshToken,
  );

  return {
    success: true,
    message: 'Token refreshed successfully.',
    ...tokens,
  };
}
  //---------------------------------------
  // Logout
  //---------------------------------------
  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });

    return {
      message: 'Logged out successfully',
    };
  }

//---------------------------------------
// Save Refresh Token
//---------------------------------------
private async saveRefreshToken(
  userId: string,
  token: string,
) {
  const hashedToken = await bcrypt.hash(
    token,
    10,
  );

  await this.prisma.refreshToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000,
      ),
    },
  });
}

//---------------------------------------
// Forgot Password
//---------------------------------------
async forgotPassword(
  dto: ForgotPasswordDto,
) {
  const user =
    await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

  // Don't reveal whether the email exists
  if (!user) {
    return {
      success: true,
      message:
        'If the email exists, a password reset link has been sent.',
    };
  }

  const resetToken =
    await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        type: 'password-reset',
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await this.mailService.sendForgotPasswordEmail(
      user.email,
      user.fullName,
      resetLink,
    );
  } catch (error) {
    console.error(
      'Failed to send reset email:',
      error,
    );
  }

  return {
    success: true,
    message:
      'If the email exists, a password reset link has been sent.',
  };
}
  //---------------------------------------
  // Generate JWT Tokens
  //---------------------------------------
  private async generateTokens(
    userId: string,
    email: string,
  ) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

 

//---------------------------------------
// Reset Password
//---------------------------------------
async resetPassword(dto: ResetPasswordDto) {
  const payload = await this.jwtService.verifyAsync(dto.token, {
    secret: process.env.JWT_ACCESS_SECRET,
  });

  if (payload.type !== 'password-reset') {
    throw new UnauthorizedException('Invalid reset token.');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  await this.prisma.user.update({
    where: {
      id: payload.sub,
    },
    data: {
      passwordHash: hashedPassword,
    },
  });

  // Invalidate all refresh tokens
  await this.prisma.refreshToken.deleteMany({
    where: {
      userId: payload.sub,
    },
  });

  return {
    success: true,
    message: 'Password updated successfully.',
  };
}

  //---------------------------------------
  // Validate User
  //---------------------------------------
  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
      },
    });
  }
}