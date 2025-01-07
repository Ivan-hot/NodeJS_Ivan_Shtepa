import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Session } from './session.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: "session_id" })
  @ManyToOne(() => Session, (session) => session.messages)
  session: Session;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => User, (user) => user.sent_messages)
  sender: User;

  @JoinColumn({ name: "receiver_id" })
  @ManyToOne(() => User, (user) => user.received_messages, { nullable: true })
  receiver: User;

  @Column({ type: 'text' })
  message_text: string;

  @Column({ default: true })
  is_public: boolean;

  @CreateDateColumn()
  created_at: Date;
}
