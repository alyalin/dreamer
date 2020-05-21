import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SessionsEntity {
  @Column({
    type: 'uuid',
    unique: true
  })
  userId: string;

  @PrimaryColumn({
    type: 'text',
    unique: true
  })
  sessionId: string

  @CreateDateColumn()
  created: Date;
}
