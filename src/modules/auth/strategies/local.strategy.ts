import {Strategy} from "passport-local";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import { UserService } from '../../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  public async validate(email: string, password: string): Promise<any> {
    const userEntity = await this.userService.findByEmail(email);

    if (!userEntity) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.userService.comparePasswords(password, userEntity.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return userEntity.toSessionSerializer();
  }
}
