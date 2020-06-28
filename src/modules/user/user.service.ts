import { HttpService, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { UserEntity } from './entities/user.entity'
import { SignUpDto } from '../auth/dto/sign-up.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private httpService: HttpService,
  ) {
  }

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
      return argon2.verify(hash, password)
    } catch (e) {
      throw e
    }
  }

  async createUser(data: SignUpDto) {
    try {
      const newUser = await this.userRepository.create({
        email: data.email,
        checkbox: data.checkbox,
        password: await argon2.hash(data.password),
      })
      await this.userRepository.save(newUser)
      return newUser.toResponseObject()
    } catch (e) {
      throw e
    }
  }

  async addFacebookData(
    token: string,
  ) {
    try {
      const { data } = await this.httpService.get(
        `https://graph.facebook.com/v7.0/me?access_token=${token}&fields=first_name,last_name,email`,
      ).toPromise()

      const user = await this.findByEmail(data.email)
      if (user) {
        if (!user.username) {
          user.username = data.first_name
        }
        if (!user.lastname) {
          user.lastname = data.last_name
        }
        user.facebook_id = data.id

        const updatedUser = await this.userRepository.save(user)

        return updatedUser.toResponseObject()
      }

      const newUser = this.userRepository.create({
        email: data.email,
        facebook_id: data.id,
        lastname: data.last_name,
        username: data.first_name,
      })
      await this.userRepository.save(newUser)
      return newUser.toResponseObject()
    } catch (e) {
      throw e
    }
  }
}
