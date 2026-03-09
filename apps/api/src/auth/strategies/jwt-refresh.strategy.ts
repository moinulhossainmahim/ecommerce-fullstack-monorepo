import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      // Read refresh JWT from its dedicated httpOnly cookie (separate from access_token)
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET')!,
      // passReqToCallback: true as const — tells TS this is StrategyOptionsWithRequest,
      // enabling the raw Request as the first param in validate()
      passReqToCallback: true as const,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const rawToken = req.cookies?.refresh_token as string | undefined;
    if (!rawToken) throw new UnauthorizedException('No refresh token cookie');
    // Return payload + raw token string; AuthService will hash + verify against DB
    return { ...payload, rawToken };
  }
}
