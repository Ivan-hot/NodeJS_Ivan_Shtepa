import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;  

  @Column({ length: 100 })
  session_name: string;

  @OneToMany(() => Message, (message) => message.session)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.sessions)
  participants: User[];

  @Column({ type: 'boolean', default: false })
  is_private: boolean;

  @CreateDateColumn()
  created_at: Date;
    userGroups: any;
}
