import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Message } from '../../messages/entity/message.entity';
import { Session } from '../../messages/entity/session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 50 })
  nick_name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Message, (message) => message.sender)
  sent_messages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  received_messages: Message[];
  
  @ManyToMany(() => Session, (session) => session.participants)
  @JoinTable({
    name: 'user_sessions_session',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'session_id',
      referencedColumnName: 'id',
    },
  })
  sessions: Session[];
}
