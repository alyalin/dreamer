import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { UserEntity } from './entities/user.entity';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { USER_ROLES } from './enums/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string) {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (e) {
      throw e;
    }
  }

  async findById(id: string) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (e) {
      throw e;
    }
  }

  async comparePasswords(password: string, hash: string) {
    try {
      return argon2.verify(hash, password);
    } catch (e) {
      throw e;
    }
  }

  async createUser(data: SignUpDto, role?: USER_ROLES) {
    try {
      const newUser = await this.userRepository.create({
        email: data.email,
        checkbox: data.checkbox,
        password: await argon2.hash(data.password),
      });
      await this.userRepository.save(newUser);
      return newUser.toResponseObject();
    } catch (e) {
      throw e;
    }
  }

  async addFacebookData(token: string) {
    try {
      const { data } = await this.httpService
        .get(
          `https://graph.facebook.com/v7.0/me?access_token=${token}&fields=first_name,last_name,email`,
        )
        .toPromise();

      const user = await this.findByEmail(data.email);
      if (user) {
        if (!user.firstName) {
          user.firstName = data.first_name;
        }
        if (!user.lastName) {
          user.lastName = data.last_name;
        }
        user.facebook_id = data.id;

        const updatedUser = await this.userRepository.save(user);

        return updatedUser.toResponseObject();
      }

      const newUser = this.userRepository.create({
        email: data.email,
        facebook_id: data.id,
        lastName: data.last_name,
        firstName: data.first_name,
      });
      await this.userRepository.save(newUser);
      return newUser.toResponseObject();
    } catch (e) {
      throw e;
    }
  }

  async addVkData(token: string) {
    try {
      // запрашиваем access_token
      const { data } = await this.httpService
        .get(
          `https://oauth.vk.com/access_token?client_id=7527042&client_secret=wE72lZwl38cqUYphmT5N&redirect_uri=${this.configService.get(
            'VK_REDIRECT',
          )}&code=${token}`,
        )
        .toPromise();

      // запрашиваем данные о пользователе
      const userInfo = await this.httpService
        .get(
          `https://api.vk.com/method/users.get?&access_token=${data.access_token}&v=5.92`,
        )
        .toPromise();

      const user = await this.findByEmail(data.email);
      if (user) {
        if (!user.firstName) {
          user.firstName = userInfo.data.response.first_name;
        }
        if (!user.lastName) {
          user.lastName = userInfo.data.response.last_name;
        }
        user.vk_id = data.user_id;

        const updatedUser = await this.userRepository.save(user);

        return updatedUser.toResponseObject();
      }

      const newUser = this.userRepository.create({
        email: data.email ? data.email : null,
        vk_id: data.user_id,
        lastName: userInfo.data.response.last_name,
        firstName: userInfo.data.response.first_name,
      });
      await this.userRepository.save(newUser);
      return newUser.toResponseObject();
    } catch (e) {
      throw e;
    }
  }
}
