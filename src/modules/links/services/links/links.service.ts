import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { addHours, addMinutes, isAfter } from 'date-fns'
import * as argon2 from 'argon2'

import { UserEntity } from '../../../user/entities/user.entity'
import { LINK_TYPE } from '../../enums/links-type.enum'
import { LinksEntity } from '../../entities/links.entity'
import { Errors } from '../../../../constants';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinksEntity)
    private linksRepository: Repository<LinksEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
  }

  async create(userId: string, type: LINK_TYPE, email?: string) {
    let user: UserEntity;
    if (userId) {
      user = await this.userRepository.findOne({ where: { id: userId } })
    }

    if (email) {
      user = await this.userRepository.findOne({ where: { email } })
    }

    if (!user) {
      throw new BadRequestException()
    }

    if (type === LINK_TYPE.RESET_PW) {
      const isResetPasswordExist = await this.linksRepository.findOne({
        where: { type: LINK_TYPE.RESET_PW, user: user },
        relations: ['user'],
      })

      if (isResetPasswordExist) {
        if (isAfter(new Date(), isResetPasswordExist.deleteDate)) {
          await this.linksRepository.remove(isResetPasswordExist)
        } else {
          throw new HttpException(Errors.RESET_PASSWORD_ERROR, 400)
        }
      }
    }

    if (type === LINK_TYPE.EMAIL) {
      const isConfirmEmailExist = await this.linksRepository.findOne({
        where: { type: LINK_TYPE.EMAIL, user: user },
        relations: ['user'],
      })

      if (isConfirmEmailExist) {
        if (isAfter(new Date(), isConfirmEmailExist.deleteDate)) {
          await this.linksRepository.remove(isConfirmEmailExist)
        } else {
          throw new HttpException(Errors.RESET_EMAIl_ERROR, 400)
        }
      }
    }

    let deletedTime: Date
    switch (type) {
      case LINK_TYPE.EMAIL:
        deletedTime = addHours(new Date(), 1)
        break
      case LINK_TYPE.RESET_PW:
        deletedTime = addMinutes(new Date(), 20)
        break
      default:
        deletedTime = addHours(new Date(), 1)
        break
    }
    const link = this.linksRepository.create({
      created: new Date(),
      deleteDate: deletedTime,
      hash: nanoid(36),
      user: user,
      type,
    })
    await this.linksRepository.save(link)

    return {
      hash: link.hash,
      user: user.toResponseObject()
    };
  }

  async confirmEmail(hash: string) {
    const foundHash = await this.linksRepository.findOne({ where: { hash }, relations: ['user'] });

    if (!foundHash) {
      throw new BadRequestException();
    }

    if (isAfter(new Date(), foundHash.deleteDate)) {
      await this.linksRepository.remove(foundHash);
      throw new HttpException(Errors.RESET_EMAIl_ERROR, 400);
    }

    foundHash.user.verified = true;
    await this.linksRepository.save(foundHash);
    await this.linksRepository.remove(foundHash);
  }

  async updatePassword(hash: string, newPassword: string) {
    const foundHash = await this.linksRepository.findOne({ where: { hash }, relations: ['user'] });

    if (!foundHash) {
      throw new BadRequestException();
    }

    if (isAfter(new Date(), foundHash.deleteDate)) {
      await this.linksRepository.remove(foundHash);
      throw new HttpException(Errors.RESET_PASSWORD_ERROR, 400);
    }

    console.log(foundHash);

    foundHash.user.password = await argon2.hash(newPassword);
    await this.linksRepository.save(foundHash);
    await this.linksRepository.remove(foundHash);
  }
}
