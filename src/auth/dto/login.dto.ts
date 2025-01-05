import { IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '$2b$10$FX4snaJWAona5cx/JofzQunSY77j5GKQT.TeV47qPpD8pNydwbMoK' })
  @IsUUID('4')
  password: string;
}
