import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDto {
  @ApiProperty({ example: 'session123' })
  @IsString()
  @IsNotEmpty()
  session_id: string;
}
