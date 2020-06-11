import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as argon2 from 'argon2';
import { SessionPayload } from '../../auth/interfaces/session-payload.interface';
import { USER_ROLES } from '../enums/roles.enum';

@Entity()
export class UserEntity {
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
    nullable: true
  })
  username: string;

  @Column('text')
  password: string;

  @Column({
    type: 'text',
    nullable: true
  })
  facebook_id: string;

  @Column({
    type: 'text',
    nullable: true
  })
  instagram_id: string;

  @Column({
    type: 'text',
    nullable: true
  })
  vk_id: string;

  // @Column({
  //   type: 'boolean'
  // })
  // checkbox: boolean;

  @Column({
    type: 'boolean',
    default: false
  })
  verified: boolean;

  @Column({
    type: 'text',
    default: USER_ROLES.DEFAULT
  })
  role: string;

  @BeforeInsert()
  async hashPassword() {
    try {
      this.password = await argon2.hash(this.password);
    } catch (e) {
      throw e;
    }
  }

  toResponseObject() {
    const { id, role  } = this;
    return { id, role };
  }

  toSessionSerializer(): SessionPayload {
    const { id, role, email, verified } = this;
    return { id, role, email, verified };
  }
}
