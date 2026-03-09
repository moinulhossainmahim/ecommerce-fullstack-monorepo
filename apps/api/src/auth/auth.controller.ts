import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly isProd: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.isProd = config.get<string>('NODE_ENV') === 'production';
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registered. Sets access_token + refresh_token cookies.',
  })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(dto.firstName, dto.lastName, dto.email, dto.password);
    const { accessToken, refreshToken } =
      await this.authService.issueTokens(user);
    this.setTokenCookies(res, accessToken, refreshToken);
    return { message: 'Registered successfully', userId: user.id };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email + password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Logged in. Sets access_token + refresh_token cookies.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 403, description: 'Account locked.' })
  async login(
    @Req() req: Request & { user: User },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.issueTokens(
      req.user,
    );
    this.setTokenCookies(res, accessToken, refreshToken);
    return { message: 'Logged in', userId: req.user.id, role: req.user.role };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token — issues new token pair' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'New access_token + refresh_token cookies set.',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalid, expired, or reused.',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { sub, rawToken } = req.user as { sub: string; rawToken: string };
    const { accessToken, refreshToken } =
      await this.authService.rotateRefreshToken(sub, rawToken);
    this.setTokenCookies(res, accessToken, refreshToken);
    return { message: 'Tokens refreshed' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout — revokes refresh token server-side' })
  @ApiCookieAuth('access_token')
  @ApiResponse({ status: 200, description: 'Logged out. Cookies cleared.' })
  @ApiResponse({ status: 401, description: 'Not authenticated.' })
  async logout(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies?.refresh_token as string | undefined;
    if (rawRefreshToken) {
      await this.authService.logout(user.id, rawRefreshToken);
    }
    this.clearTokenCookies(res);
    return { message: 'Logged out' };
  }

  // ─── Cookie helpers ───────────────────────────────────────────────────────

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const base = {
      httpOnly: true,
      secure: this.isProd,
      sameSite: 'lax' as const,
      path: '/',
    };

    res.cookie('access_token', accessToken, {
      ...base,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      ...base,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });
  }

  private clearTokenCookies(res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
  }
}
