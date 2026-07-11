import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
        password: hashedPassword,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

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
  const { email, password } = loginDto;

  const user = await this.prisma.user.findUnique({
    where: {
      email,
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

  const accessToken = await this.jwtService.signAsync({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message: 'Login successful.',
    accessToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
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
  // Refresh Token
  //---------------------------------------
  async refreshToken(token: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Expired refresh token');
    }

    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
    );

    await this.prisma.refreshToken.delete({
      where: {
        token,
      },
    });

    await this.saveRefreshToken(
      storedToken.user.id,
      tokens.refreshToken,
    );

    return tokens;
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
  // Save Refresh Token
  //---------------------------------------
  private async saveRefreshToken(
    userId: string,
    token: string,
  ) {
    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ),
      },
    });
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