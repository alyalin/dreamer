import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

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

  toResponseObject() {
    const { refreshToken, expiresAt  } = this;
    return { refreshToken, expiresAt };
  }
}
