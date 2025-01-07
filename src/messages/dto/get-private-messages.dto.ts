/*
import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetMessagesDto } from './get-messages.dto'; 

export class GetPrivateMessagesDto extends GetMessagesDto { 
  @ApiProperty({ example: 2, description: 'User ID of recipient' })
  @IsNumber()
  @IsPositive()
  receiver_id: number;
}

*/