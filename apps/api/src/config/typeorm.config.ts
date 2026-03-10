import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get<string>('DB_USERNAME', 'postgres'),
  password: config.get<string>('DB_PASSWORD', 'postgres'),
  database: config.get<string>('DB_NAME', 'ecommerce'),
  // Auto-collects entities registered via TypeOrmModule.forFeature() in any module.
  // synchronize must always be false — we use migrations exclusively.
  autoLoadEntities: true,
  synchronize: false,
  logging: config.get<string>('NODE_ENV') === 'development',
});
