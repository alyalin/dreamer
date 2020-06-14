import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import * as argon2 from 'argon2'

@Entity()
export class RefreshTokenEntity {
  @Column({
    type: 'uuid'
  })
  userId: string;

  @PrimaryColumn({
    type: 'text',
    unique: true
  })
  refreshToken: string

  @CreateDateColumn()
  expiresAt: Date;

  @Column()
  createdAt: Date;

  @BeforeInsert()
  async generateCrateDate() {
    try {
      this.createdAt = new Date();
    } catch (e) {
      throw e;
    }
  }

  toResponseObject() {
    const { refreshToken, expiresAt, userId  } = this;
    return { refreshToken, expiresAt, userId };
  }
}
