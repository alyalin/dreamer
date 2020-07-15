import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LINK_TYPE } from '../enums/links-type.enum'
import { UserEntity } from '../../user/entities/user.entity'

@Entity()
export class LinksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'text',
  })
  hash: string

  @CreateDateColumn()
  created: Date

  @Column({ type: 'timestamp without time zone' })
  deleteDate: Date

  @Column({
    type: 'text',
  })
  type: LINK_TYPE

  @ManyToOne(type => UserEntity, user => user.links)
  user: UserEntity

  toResponseObject() {
    const { hash, created, deleteDate } = this
    return { hash, created, deleteDate }
  }
}
