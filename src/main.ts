import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as connectRedis from 'connect-redis';
import * as redis from 'redis';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        signed: false,
      },
      name: process.env.COOKIE_NAME,
      resave: false,
      store: new (connectRedis(session))({
        client: redis.createClient(process.env.REDIS_HOST),
      }),
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.NEST_PORT);
  Logger.log(`Server running on http://localhost:${process.env.NEST_PORT}`, 'Bootstrap');
}
bootstrap();
