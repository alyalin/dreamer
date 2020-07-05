import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { SessionPayload } from '../../auth/interfaces/session-payload.interface'
import { USER_ROLES } from '../enums/roles.enum'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
  })
  email: string

  @Column({
    type: 'text',
    nullable: true,
  })
  firstName: string

  @Column({
    type: 'text',
    nullable: true,
  })
  lastName: string

  @Column({
    type: 'text',
    nullable: true,
  })
  password: string

  @Column({
    type: 'text',
    nullable: true,
  })
  facebook_id: string

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

  @Column({
    type: 'boolean',
    default: false
  })
  checkbox: boolean;

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

  toResponseObject() {
    const { id, role, created, firstName, lastName, email, facebook_id, instagram_id, vk_id, verified } = this
    return { id, role, created, firstName, lastName, email, facebook_id, instagram_id, vk_id, verified }
  }
}
