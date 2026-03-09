import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// @Public() marks a route as accessible without a JWT.
// The JwtAuthGuard checks this metadata and skips auth if present.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
