import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserEmailPasswordDTO } from '../auth/dto/signup.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findByEmail(email: string) {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (e) {
      throw e;
    }
  }

  async createUser(data: UserEmailPasswordDTO) {
    try {
      const newUser = await this.userRepository.create(data);
      await this.userRepository.save(newUser);
      return newUser.toResponseObject();
    } catch (e) {
      throw e;
    }
  }
}
