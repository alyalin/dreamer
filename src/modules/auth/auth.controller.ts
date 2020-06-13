import { Body, Controller, Get, Post, Req, Res, Session, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AuthService } from './services/auth/auth.service';
import { UserEmailPasswordDTO } from './dto/signup.dto';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { User } from '../../common/decorators/user.decorator'
import { RefreshTokenService } from './services/refresh-token/refresh-token.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService, private refreshTokenService: RefreshTokenService) {}

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
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production'
      })
      res.send({ access_token: tokens.access_token });
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/refreshToken')
  async refreshToken(@User('userId') userId, @Res() res: Response, @Req() req: Request) {
    if (( await this.refreshTokenService.validateRefreshToken(userId, req.cookies.refresh_token) )) {
      const tokens = await this.authService.generateNewRefreshToken(userId);
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: this.configService.get('REFRESH_TOKEN_EXPIRES') * 1000,
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production'
      })
      res.send({
        access_token: tokens.access_token
      });
    } else {
      res.cookie('refresh_token', "", {
        httpOnly: true,
        expires: new Date(0)
      });
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/secured')
  async secured() {
    return {
      message: 'You have access to this method'
    }
  }
}
