import { Body, Controller, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEmailPasswordDTO } from './dto/signup.dto';
import { LoginGuard } from './guards/login.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() data: UserEmailPasswordDTO) {
    return this.authService.register(data);
  }

  @UseGuards(LoginGuard)
  @Post('/signin')
  async signIn(@Req() req, @Res() res) {
    console.log(req.session);
    if (req.session.passport) {
      res.send({success: true});
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/secured')
  async secured(@Session() ses) {
    console.log(ses);
    return {
      message: 'You have access to this method'
    }
  }
}
