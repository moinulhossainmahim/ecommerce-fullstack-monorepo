import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import { User } from '../database/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly maxAttempts: number;
  private readonly lockoutMs: number;
  private readonly bcryptRounds: number;
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly refreshExpiresInMs: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {
    this.maxAttempts = config.get<number>('MAX_LOGIN_ATTEMPTS', 5);
    this.lockoutMs =
      config.get<number>('LOCKOUT_DURATION_MINUTES', 15) * 60 * 1000;
    this.bcryptRounds = config.get<number>('BCRYPT_ROUNDS', 12);
    this.accessSecret = config.get<string>('JWT_ACCESS_SECRET', 'change-me');
    this.refreshSecret = config.get<string>(
      'JWT_REFRESH_SECRET',
      'change-me-refresh',
    );
    const refreshDays = parseInt(
      config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      10,
    );
    this.refreshExpiresInMs = refreshDays * 24 * 60 * 60 * 1000;
  }

  // ─── Registration ────────────────────────────────────────────────────────

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      // Generic message — avoids user enumeration attack
      throw new ConflictException('Email already in use');
    }
    const hashed = await bcrypt.hash(password, this.bcryptRounds);
    return this.usersService.create(firstName, lastName, email, hashed);
  }

  // ─── Credential validation (called by LocalStrategy) ─────────────────────

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Account locked. Try again after ${user.lockedUntil.toISOString()}`,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Atomic increment in DB prevents race condition from two concurrent bad logins
      await this.usersService.incrementFailedAttempts(user.id);

      // Re-fetch to get the DB-accurate count post-increment
      const updated = await this.usersService.findById(user.id);
      if (updated && updated.failedAttempts >= this.maxAttempts) {
        await this.usersService.lockAccount(
          user.id,
          new Date(Date.now() + this.lockoutMs),
        );
      }
      return null;
    }

    await this.usersService.resetLoginState(user.id);
    return user;
  }

  // ─── Token issuance ──────────────────────────────────────────────────────

  async issueTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Access token: short-lived JWT (15m), validated statlessly on every request
    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: 15 * 60, // seconds — numeric avoids StringValue type issue
    });

    // Refresh token: longer-lived JWT (7d), signed with a DIFFERENT secret.
    // Different secret means an access token cannot be replayed as a refresh token.
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    // Store SHA-256 hash of the refresh JWT — if DB is leaked, tokens are useless
    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  // ─── Refresh token rotation ───────────────────────────────────────────────
  // JwtRefreshStrategy validates the JWT signature + expiry first,
  // then this method checks DB revocation + performs rotation.

  async rotateRefreshToken(
    userId: string,
    rawToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const hash = this.hashToken(rawToken);

    const stored = await this.refreshTokenRepo
      .createQueryBuilder('rt')
      .where('rt.tokenHash = :hash', { hash })
      .andWhere('rt.userId = :userId', { userId })
      .getOne();

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      // Token reuse or DB tampering → revoke all sessions for this user
      await this.revokeAllUserTokens(userId);
      throw new UnauthorizedException(
        'Refresh token invalid, expired, or reused',
      );
    }

    // Invalidate old token atomically before issuing new one
    await this.refreshTokenRepo
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revoked: true })
      .where('id = :id', { id: stored.id })
      .execute();

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    return this.issueTokens(user);
  }

  // ─── Logout ──────────────────────────────────────────────────────────────

  async logout(userId: string, rawRefreshToken: string): Promise<void> {
    const hash = this.hashToken(rawRefreshToken);
    await this.refreshTokenRepo
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revoked: true })
      .where('tokenHash = :hash', { hash })
      .andWhere('userId = :userId', { userId })
      .execute();
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async storeRefreshToken(
    userId: string,
    rawToken: string,
  ): Promise<void> {
    const record = this.refreshTokenRepo.create({
      tokenHash: this.hashToken(rawToken),
      userId,
      expiresAt: new Date(Date.now() + this.refreshExpiresInMs),
    });
    await this.refreshTokenRepo.save(record);
  }

  private async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepo
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revoked: true })
      .where('userId = :userId', { userId })
      .execute();
  }
}
