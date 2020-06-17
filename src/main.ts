import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { config } from 'dotenv';
import cookieParser = require('cookie-parser');

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['log', 'debug', 'error', 'verbose', 'warn'],
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(passport.initialize());
  app.use(cookieParser());
  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: process.env.CORS_URL,
      credentials: true,
    });
  }
  await app.listen(process.env.APP_PORT);
  Logger.log(
    `Server running on http://localhost:${process.env.APP_PORT}`,
    'Bootstrap',
  );
}
bootstrap();
