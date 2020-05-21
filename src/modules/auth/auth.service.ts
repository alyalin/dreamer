import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

  constructor(private userService: UserService) {
  }

  async register(data: SignUpDTO) {
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
