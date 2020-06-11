import { Body, Controller, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UserEmailPasswordDTO } from './dto/signup.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Post('/signup')
  async signUp(@Body() data: UserEmailPasswordDTO) {
    return this.authService.register(data);
  }

  @Post('/signin')
  async signIn(@Body() data: UserEmailPasswordDTO, @Res() res: Response) {

    try {
      const tokens = await this.authService.login(data);
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: this.configService.get('REFRESH_TOKEN_EXPIRES') * 1000,
        httpOnly: true
      })
      res.send({ access_token: tokens.access_token });
    } catch (e) {
      throw e;
    }
  }

  @Post('/secured')
  async secured() {
    return {
      message: 'You have access to this method'
    }
  }
}
