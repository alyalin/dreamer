import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { USER_ROLES } from '../enums/roles.enum';
import { LinksEntity } from '../../links/entities/links.entity';

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
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  facebook_id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  instagram_id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  vk_id: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  checkbox: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @Column({
    type: 'text',
    default: USER_ROLES.DEFAULT,
  })
  role: string;

  @OneToMany(
    type => LinksEntity,
    links => links.user,
  )
  links: LinksEntity[];

  toResponseObject() {
    const {
      id,
      role,
      created,
      firstName,
      lastName,
      email,
      facebook_id,
      instagram_id,
      vk_id,
      verified,
    } = this;
    return {
      id,
      role,
      created,
      firstName,
      lastName,
      email,
      facebook_id,
      instagram_id,
      vk_id,
      verified,
    };
  }
}
