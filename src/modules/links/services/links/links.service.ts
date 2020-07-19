import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { nanoid } from 'nanoid'
import { addHours, addMinutes, isAfter } from 'date-fns'

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

  async getAll(userId: string) {
    const links = await this.linksRepository.find({ relations: ['user'] })
    console.log(links)
  }

  async create(userId: string, type: LINK_TYPE) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } })

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

      return link.hash;
    } catch (e) {
      throw e
    }
  }
}
