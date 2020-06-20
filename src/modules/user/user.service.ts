import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { UserEntity } from './entities/user.entity';
import { SignUpDto } from '../auth/dto/sign-up.dto'

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

  async findById(id: string) {
    try {
      return await this.userRepository.findOne({ where: { id } })
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

  async createUser(data: SignUpDto) {
    try {
      const newUser = await this.userRepository.create(data);
      await this.userRepository.save(newUser);
      return newUser.toResponseObject();
    } catch (e) {
      throw e;
    }
  }
}
