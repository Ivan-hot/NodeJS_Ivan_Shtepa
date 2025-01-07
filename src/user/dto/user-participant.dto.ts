import { Expose } from 'class-transformer';

export class UserParticipantDto {
  @Expose()
  id: number;

  @Expose()
  nick_name: string;
}
