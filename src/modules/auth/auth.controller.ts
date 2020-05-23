import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEmailPasswordDTO } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() data: UserEmailPasswordDTO) {
    return this.authService.register(data);
  }

  @Post('/signin')
  async signIn(@Body() data: UserEmailPasswordDTO) {

  }
}
