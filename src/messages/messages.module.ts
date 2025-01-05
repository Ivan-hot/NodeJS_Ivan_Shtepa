import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { Message } from './entity/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './gateway/messages.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Session } from './entity/session.entity';
import { User } from '../user/entity/user.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Session, User]), 
    AuthModule,
    UsersModule,
    JwtModule,
    SocketModule,
  ],
  providers: [MessagesService, MessagesGateway],
  controllers: [MessagesController],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
