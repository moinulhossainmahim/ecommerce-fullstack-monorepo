import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser = require('cookie-parser');
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const isProd = config.get<string>('NODE_ENV') === 'production';

  app.use(cookieParser());

  // Disable helmet's contentSecurityPolicy in dev so Swagger UI loads its scripts
  app.use(helmet({ contentSecurityPolicy: isProd }));

  app.enableCors({
    origin: config.get<string>('WEB_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  // ── Swagger — only in non-production ──────────────────────────────────────
  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Ecommerce API')
      .setDescription('Auth, products, orders — full ecommerce backend')
      .setVersion('1.0')
      // Cookie-based auth: tells Swagger to send the access_token cookie
      .addCookieAuth('access_token')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    // Available at: http://localhost:5001/docs
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        // Persist auth between page refreshes in the browser
        persistAuthorization: true,
      },
    });
  }

  const port = config.get<number>('PORT', 5001);
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api/v1`);
  if (!isProd) console.log(`Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
