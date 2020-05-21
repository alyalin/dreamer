import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as argon2 from 'argon2';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'text',
    unique: true
  })
  email: string;

  @Column({
    type: 'text',
    unique: true
  })
  username: string;

  @Column('text')
  password: string;

  @Column({
    type: 'text',
    unique: true
  })
  facebookId: string;

  @Column({
    type: 'text',
    unique: true
  })
  instagramId: string;

  @Column({
    type: 'text',
    unique: true
  })
  vkId: string;

  @Column({
    type: 'boolean'
  })
  checkBox: boolean;

  @Column({
    type: 'boolean'
  })
  verified: boolean;

  @BeforeInsert()
  async hashPassword() {
    try {
      this.password = await argon2.hash(this.password);
    } catch (e) {
      throw e;
    }
  }

  toResponseObject() {
    const { id, created, username } = this;
    return { id, created, username };
  }
}
