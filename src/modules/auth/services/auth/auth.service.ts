import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../user/user.service';
import { SignUpDto } from '../../dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '../../dto/sign-in.dto';
import { AwsSESService } from '../../../../common/services/aws-ses.service';
import { LinksService } from '../../../links/services/links/links.service';
import { LINK_TYPE } from '../../../links/enums/links-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private awsSESService: AwsSESService,
    private linksService: LinksService
  ) {}

  async register(data: SignUpDto) {
    try {
      let user = await this.userService.findByEmail(data.email);
      if (user) {
        throw new HttpException('This user already exist', 409);
      }

      const newUser = await this.userService.createUser(data);
      const confirmEmailLinkHash = await this.linksService.create(newUser.id, LINK_TYPE.EMAIL);
      const confirmEmailLink = `${this.configService.get('CONFIRM_EMAIL_LINK')}${confirmEmailLinkHash.hash}`;

      await this.awsSESService.sendWelcomeEmail(data.email, confirmEmailLink)
      return newUser;
    } catch (e) {
      throw e;
    }
  }

  async login(data: SignInDto) {
    try {
      const user = await this.userService.findByEmail(data.email);
      if (!user) {
        throw new UnauthorizedException();
      }
      const isPasswordValid = await this.userService.comparePasswords(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }
      // const userRefreshToken = await this.refreshTokenService.findByUserId(
      //   user.id,
      // );
      const userPayload = user.toResponseObject();
      const payload = {
        sub: userPayload.id,
        role: userPayload.role,
      };

      return await this.generateJwtAndRefreshTokens(user.id, payload);

    } catch (e) {
      throw e;
    }
  }

  async generateNewJwtToken(userId) {
    try {
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException();
      }

      const userPayload = user.toResponseObject();
      const payload = {
        sub: userPayload.id,
        role: userPayload.role,
      }

      return {
        access_token: this.jwtService.sign(payload)
      };
    } catch (e) {
      throw e;
    }
  }

  async generateJwtAndRefreshTokens(userId, jwtPayload) {
    try {
      const createdToken = await this.refreshTokenService.createRefreshToken(
        userId,
        nanoid(15),
        new Date(
          new Date().getTime() +
          this.configService.get('REFRESH_TOKEN_EXPIRES') * 1000,
        ),
      );

      return {
        access_token: this.jwtService.sign(jwtPayload),
        refresh_token: createdToken.refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }
}
