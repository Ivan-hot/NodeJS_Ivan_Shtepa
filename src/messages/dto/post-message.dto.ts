import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, IsPositive, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostMessageDto {
  @ApiProperty({ example: 'ee4c4858-9ed0-4533-a3d5-6980b648af8b' })
  @IsString()
  @IsNotEmpty()
  session_id: string;

  @ApiProperty({ example: 'Hello World!' })
  @IsString()
  @IsNotEmpty()
  message_text: string;

  @ApiPropertyOptional({ example: '2', description: 'Recipient ID for private messages' })
  @ValidateIf((o) => o.is_public === false)
  @IsOptional()
  @IsInt()
  @IsPositive()
  receiver_id?: number;

  @ApiPropertyOptional({ example: true, description: 'Public or private message' })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean = true;
}
