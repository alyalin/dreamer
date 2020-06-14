import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
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

  @Post('/refresh-token')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    if (!req.cookies.refresh_token) {
      throw new BadRequestException();
    }
    const validToken = await this.refreshTokenService.validateRefreshToken(req.cookies.refresh_token);

    if (!validToken) {
      throw new BadRequestException();
    }

    if (validToken.valid) {
      const jwtToken = await this.authService.generateNewJwtToken(validToken.token.userId);
      res.cookie('refresh_token', validToken.token.refreshToken, {
        maxAge: validToken.token.expiresAt * 1000,
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production'
      })
      res.send({
        access_token: jwtToken.access_token
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
  @Get('/logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    console.log(req.cookies);
    await this.refreshTokenService.invalidateRefreshToken(req.cookies.refresh_token);
    res.cookie('refresh_token', "", {
      httpOnly: true,
      expires: new Date(0)
    });
    res.send({ success: true })
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/secured')
  async secured() {
    return {
      message: 'You have access to this method'
    }
  }
}
