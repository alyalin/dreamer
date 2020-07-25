import { HttpModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AuthService } from './services/auth/auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RefreshTokenService } from './services/refresh-token/refresh-token.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { LinksModule } from '../links/links.module'
import { AwsSESService } from '../../common/services/aws-ses.service';

@Module({
  imports: [
    LinksModule,
    UserModule,
    HttpModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        defaultStrategy: 'jwt',
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_TIME') }
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenService, AwsSESService],
})
export class AuthModule {}
