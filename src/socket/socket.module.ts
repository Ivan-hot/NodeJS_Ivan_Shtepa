import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { MessagesService } from '../messages/messages.service';
import { ActiveUsersService } from '../user/active-users.service';
import { MessagesModule } from '../messages/messages.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:  [forwardRef(() => MessagesModule)],
  providers: [JwtService,SocketService, MessagesService, ActiveUsersService],
  exports: [SocketService],
})
export class SocketModule {}
