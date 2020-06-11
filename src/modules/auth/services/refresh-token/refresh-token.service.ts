import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RefreshTokenEntity } from '../../entities/refresh-token.entity'

@Injectable()
export class RefreshTokenService {
  constructor(@InjectRepository(RefreshTokenEntity)
              private refreshTokenRepository: Repository<RefreshTokenEntity>) {
  }

  async findByUserId(userId: string) {
    try {
      return await this.refreshTokenRepository.findOne({ where: { userId } });
    } catch (e) {
      throw e;
    }
  }

  async createRefreshToken(userId: string, tokenId: string, expiresAt: Date) {
    try {
      const newToken = await this.refreshTokenRepository.create({ refreshToken: tokenId, userId, expiresAt });
      await this.refreshTokenRepository.save(newToken);
      return newToken.toResponseObject();
    }
     catch (e) {
      throw e;
    }
  }
}
