import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './serializer/session.serializer';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer]
})
export class AuthModule {}
