import { IsString, IsNotEmpty, IsBoolean, IsArray  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitSessionDto {
  @ApiProperty({ example: 'Project Discussion' })
  @IsString()
  @IsNotEmpty()
  session_name: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  is_private: boolean;

  @ApiProperty({ example: ['1', '2', '3'] })
  @IsArray()
  @IsNotEmpty()
  participants: string[];
}
