import { Expose, Exclude, Type } from 'class-transformer';
import { UserParticipantDto } from '../../user/dto/user-participant.dto';

export class SessionDto {
  @Expose()
  id: string;

  @Expose()
  session_name: string;

  @Expose()
  is_private: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  participants: UserParticipantDto[];
}
