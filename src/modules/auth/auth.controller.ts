import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenService } from './services/refresh-token/refresh-token.service';
import { SignInDto } from './dto/sign-in.dto';
import { SocialTokenDto } from './dto/social.dto';
import { UserService } from '../user/user.service';
import { User } from '../../common/decorators/user.decorator';
import { LinksService } from '../links/services/links/links.service';
import { LINK_TYPE } from '../links/enums/links-type.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordByEmailDto } from './dto/reset-password-by-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
    private linksService: LinksService
  ) {
  }

  @Post('/signup')
  async signUp(@Body() data: SignUpDto) {
    return this.authService.register(data)
  }

  @Post('/signin')
  async signIn(@Body() data: SignInDto, @Res() res: Response) {
    try {
      const tokens = await this.authService.login(data)
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: this.configService.get('REFRESH_TOKEN_EXPIRES') * 1000,
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
      })
      res.send({ access_token: tokens.access_token })
    } catch (e) {
      throw e;
    }
  }

  @Post('/refresh-token')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    if (!req.cookies.refresh_token) {
      throw new BadRequestException()
    }
    const validToken = await this.refreshTokenService.validateRefreshToken(
      req.cookies.refresh_token,
    )

    if (!validToken) {
      throw new BadRequestException()
    }

    if (validToken.valid) {
      const jwtToken = await this.authService.generateNewJwtToken(
        validToken.token.userId,
      )
      res.cookie('refresh_token', validToken.token.refreshToken, {
        maxAge: validToken.token.expiresAt * 1000,
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
      })
      res.send({
        access_token: jwtToken.access_token,
      })
    } else {
      res.cookie('refresh_token', '', {
        httpOnly: true,
        expires: new Date(0),
      })
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    await this.refreshTokenService.invalidateRefreshToken(
      req.cookies.refresh_token,
    )
    res.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    res.send({ success: true })
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/secured')
  async secured() {
    return {
      message: 'You have access to this method',
    }
  }

  @Get('/csrf-token')
  async getCSRFToken(@Req() req) {
    return {
      token: req.csrfToken(),
    }
  }

  @Post('/fb/token')
  async fbToken(@Body() body: SocialTokenDto, @Res() res: Response) {
    try {
      const user = await this.userService.addFacebookData(body.token)
      const tokens = await this.authService.generateJwtAndRefreshTokens(
        user.id,
        { sub: user.id, role: user.role },
      )
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: this.configService.get('REFRESH_TOKEN_EXPIRES') * 1000,
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
      })
      res.send({
        access_token: tokens.access_token,
      })
    } catch (e) {
      throw new HttpException(e.response.statusText, e.response.status)
    }
  }

  @Post('/vk/token')
  async vkTokenHandler(@Body() body: SocialTokenDto, @Res() res: Response) {
    try {
      const user = await this.userService.addVkData(body.token)
      const tokens = await this.authService.generateJwtAndRefreshTokens(
        user.id,
        { sub: user.id, role: user.role },
      )
      res.cookie('refresh_token', tokens.refresh_token, {
        maxAge: this.configService.get('REFRESH_TOKEN_EXPIRES') * 1000,
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
      })
      res.send({
        access_token: tokens.access_token,
      })
    } catch (e) {
      throw new HttpException(e.response.statusText, e.response.status)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/reset-password')
  async resetPassword(@User('userId') userId: string, @Body() data: ResetPasswordDto) {
    return await this.userService.resetPassword(userId, data.password);
  }

  @Post('/reset-password-email')
  async resetPasswordByEmail(@Body() data: ResetPasswordByEmailDto) {
    return await this.userService.resetPasswordByEmail(data.hash, data.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/hash')
  async hash(@User('userId') userId: string) {
    await this.linksService.create(userId, LINK_TYPE.RESET_PW);
  }
}
