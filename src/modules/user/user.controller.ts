import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '../../common/decorators/user.decorator'
import { AuthGuard } from '@nestjs/passport'

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@User('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    return user.toResponseObject();
  }
}
