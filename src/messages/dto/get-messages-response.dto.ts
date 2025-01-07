import { IsBoolean, IsUUID } from 'class-validator';

export class GetMessagesDto {
  @IsUUID()
  session_id: string;
/*
  @IsBoolean()
  is_public: boolean;
  */
}
