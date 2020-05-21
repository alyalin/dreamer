import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class SessionsEntity {
  @Column({
    type: 'uuid',
    unique: true
  })
  userId: string;

  @Column({
    type: 'text',
    unique: true
  })
  sessionId: string

  @CreateDateColumn()
  created: Date;
}
