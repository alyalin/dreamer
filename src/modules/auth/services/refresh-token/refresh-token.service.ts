import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async findByUserId(userId: string) {
    try {
      return await this.refreshTokenRepository.findOne({ where: { userId } });
    } catch (e) {
      throw e;
    }
  }

  async createRefreshToken(userId: string, tokenId: string, expiresAt: Date) {
    try {
      await this.checkRefreshTokensCount(userId);
      const newToken = await this.refreshTokenRepository.create({
        refreshToken: tokenId,
        userId,
        expiresAt,
      });
      await this.refreshTokenRepository.save(newToken);
      return newToken.toResponseObject();
    } catch (e) {
      throw e;
    }
  }

  async checkRefreshTokensCount(userId: string) {
    try {
      const [tokens, count] = await this.refreshTokenRepository.findAndCount({
        where: { userId },
      });
      if (count >= 10) {
        const oldest = tokens.reduce((c, n) =>
          n.createdAt < c.createdAt ? n : c,
        );
        await this.refreshTokenRepository.remove(oldest);
      }
    } catch (e) {
      throw e;
    }
  }

  async validateRefreshToken(refreshToken): Promise<{ token: { refreshToken, expiresAt, userId }, valid: boolean }> {
    try {
      const token = await this.refreshTokenRepository.findOne({
        where: { refreshToken },
      });

      if (!token) {
        throw new UnauthorizedException();
      }

      return {
        token: token.toResponseObject(),
        valid: token.expiresAt >= new Date()
      };
    } catch (e) {
      throw e;
    }
  }

  async invalidateRefreshToken(refreshToken) {
    try {
      const token = await this.refreshTokenRepository.findOne({ where: { refreshToken } });
      if (!token) {
        throw new NotFoundException();
      }
      if (token.expiresAt > new Date()) {
        token.expiresAt = new Date();
        await this.refreshTokenRepository.save(token);
      }
    } catch (e) {
      throw e;
    }
  }
}
