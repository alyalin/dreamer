import {Strategy} from "passport-local";
import {PassportStrategy} from "@nestjs/passport";
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { SessionPayload } from '../interfaces/session-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  public async validate(email: string, password: string): Promise<SessionPayload> {
    const userEntity = await this.userService.findByEmail(email);

    if (!userEntity) {
      throw new HttpException('Invalid username or password', 401);
    }

    const isPasswordValid = await this.userService.comparePasswords(password, userEntity.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid username or password', 401);
    }

    return userEntity.toSessionSerializer();
  }
}
