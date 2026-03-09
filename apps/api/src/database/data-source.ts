import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'ecommerce',
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  synchronize: false, // NEVER true — always use migrations
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
