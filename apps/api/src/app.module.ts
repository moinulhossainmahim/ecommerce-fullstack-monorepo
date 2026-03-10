import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    // ConfigModule loaded first — everything else depends on env vars
    ConfigModule.forRoot({
      isGlobal: true, // no need to import ConfigModule in every module
      envFilePath: '.env',
    }),

    // TypeORM — configured via env vars
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
