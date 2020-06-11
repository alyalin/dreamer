import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../../user/user.service';
import { UserEmailPasswordDTO } from '../../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: UserEmailPasswordDTO) {
    try {
      let user = await this.userService.findByEmail(data.email);
      if (user) {
        throw new HttpException('This user already exist', 409);
      }
      return this.userService.createUser(data);
    } catch (e) {
      throw e;
    }
  }

  async login(data: UserEmailPasswordDTO) {
    try {
      const user = await this.userService.findByEmail(data.email);
      const isPasswordValid = await this.userService.comparePasswords(
        data.password,
        user.password,
      );
      if (!user || !isPasswordValid) {
        throw new UnauthorizedException();
      }
      const userRefreshToken = await this.refreshTokenService.findByUserId(
        user.id,
      );
      const userPayload = user.toResponseObject();
      const payload = {
        sub: userPayload.id,
        role: userPayload.role,
      };

      if (userRefreshToken) {
        // gen new token if is exist
      } else {
        const createdToken = await this.refreshTokenService.createRefreshToken(
          user.id,
          nanoid(15),
          new Date(
            new Date().getTime() +
            this.configService.get('REFRESH_TOKEN_EXPIRES') * 60 * 1000,
          ),
        );

        return {
          access_token: this.jwtService.sign(payload),
          refresh_token: createdToken.refreshToken,
        };
      }

    } catch (e) {
      throw e;
    }
  }
}
