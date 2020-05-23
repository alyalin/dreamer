import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEmailPasswordDTO } from './dto/signup.dto';

@Injectable()
export class AuthService {

  constructor(private userService: UserService) {
  }

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
}
