import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Session } from '../../messages/entity/session.entity';

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id' })
  sessionId: number; // Привязка к имени колонки session_id в базе данных

  @ManyToOne(() => Session, (session) => session.userGroups, { eager: true })
  @JoinColumn({ name: 'session_id' }) // Укажите явное связывание с колонкой session_id
  session: Session;

  @ManyToOne(() => User, (user) => user.userGroups)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  is_creator: boolean;
}