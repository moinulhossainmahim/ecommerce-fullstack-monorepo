import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { RefreshToken } from './users/entities/refresh-token.entity';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    // ConfigModule loaded first — everything else depends on env vars
    ConfigModule.forRoot({
      isGlobal: true,   // no need to import ConfigModule in every module
      envFilePath: '.env',
    }),

    // TypeORM — configured via env vars
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'ecommerce'),
        entities: [User, RefreshToken],
        // synchronize must always be false — we use migrations exclusively.
        // synchronize:true would race against migrations and corrupt the schema.
        synchronize: false,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Rate limiting — 20 requests per 60 seconds globally.
    // Auth endpoints get tighter limits via @Throttle() on the controller.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),

    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Apply JwtAuthGuard globally — every route requires a valid JWT by default.
    // Routes opt out with @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },

    // RolesGuard runs after JwtAuthGuard — user must be authenticated first.
    { provide: APP_GUARD, useClass: RolesGuard },

    // ThrottlerGuard applies rate limiting globally.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
