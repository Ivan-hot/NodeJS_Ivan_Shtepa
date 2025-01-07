import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: 3, description: 'Message ID' })
  id: number;

  @ApiProperty({ example: 'Hello World!', description: 'Text of the message' })
  message_text: string;

  @ApiProperty({ example: true, description: 'Whether the message is public' })
  is_public: boolean;

  @ApiProperty({ example: '2024-11-14T13:48:03.257Z', description: 'When the message was created' })
  created_at: Date;

  @ApiProperty({ example: { id: 1, nick_name: 'John_Doe' }, description: 'Sender of the message' })
  sender: { id: number; nick_name: string };

  @ApiProperty({
    example: { id: 2, nick_name: 'hgffh' },
    description: 'Receiver of the message (nullable for public messages)',
  })
  receiver?: { id: number; nick_name: string };

  @ApiProperty({
    example: { id: '3bfc7033-0247-460f-af5a-48e136b346db', session_name: 'Project папаапап' },
    description: 'Session details',
  })
  session: { id: string; session_name: string };
}
