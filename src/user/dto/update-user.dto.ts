import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: '$2b$10$1ixMO89Komb9a9ptCjNmNeQ/.g8ddmgrDNdHdvjDFAJzFTeS7i/P6',
    description: 'Old user password (hashed)',
  })
  @IsString()
  @MinLength(60)
  oldPassword: string;

  @ApiProperty({
    example: '$2b$10$AX2nx7qn5QasKqGPAWi2AOSYPGvK6i3H7SSIftW81rirRuXKxco7a',
    description: 'New user password (hashed)',
  })
  @IsString()
  @MinLength(60)
  newPassword: string;
}
