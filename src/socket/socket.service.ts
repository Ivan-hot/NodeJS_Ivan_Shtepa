import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ActiveUsersService } from '../user/active-users.service';
import { MessagesService } from '../messages/messages.service';
import { PostMessageDto } from '../messages/dto/post-message.dto';

@Injectable()
export class SocketService {
  private server: Server;
  private readonly logger = new Logger('SocketService');

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagesService: MessagesService,
    private readonly activeUsersService: ActiveUsersService,
  ) {}

  public initializeServer(server: Server): void {
    this.server = server;
  }

  async handleClientConnection(client: Socket): Promise<void> {
    const token = client.handshake.query.token as string;

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const payload = this.jwtService.verify(token);
    client.data.user = payload;
    this.activeUsersService.addUser(payload.sub, client);
    this.logger.log(`User ${payload.sub} connected`);

    this.server.emit('activeUsers', this.activeUsersService.getActiveUsers());
  }

  async removeSubscription(client: Socket): Promise<void> {
    const user = client.data.user;
    if (user?.sub) {
      this.activeUsersService.removeUser(user.sub);
      this.logger.log(`User ${user.sub} disconnected`);
      this.server.emit('activeUsers', this.activeUsersService.getActiveUsers());
    }
  }

  async handleSendMessage(client: Socket, data: PostMessageDto): Promise<void> {
    const user = client.data.user;
  
    if (!user) {
      throw new UnauthorizedException('User not authorized');
    }
  
    const result = await this.messagesService.create(data, user.sub);
    const { message, participants } = result; 
    if (message.is_public) {
      this.server.emit('newPublicMessage', { message, participants });
    } else {
      const receiverSocket = this.activeUsersService.getSocketByUserId(
        message.receiver?.id,
      );
      if (receiverSocket) {
        receiverSocket.emit('newPrivateMessage', { message, participants });
      }
      client.emit('newPrivateMessage', { message, participants });
    }
  
    this.logger.log(`User ${user.sub} sent a message: ${data.message_text}`);
  }
  

  async handleTokenUpdate(client: Socket, data: any): Promise<void> {
    try {
      const payload = this.jwtService.verify(data.access_token);
      client.data.user = payload;
      this.activeUsersService.addUser(payload.sub, client);
      this.logger.log(`User ${payload.sub} updated token`);

      client.emit('tokenUpdated', { access_token: data.access_token });
      this.server.emit('activeUsers', this.activeUsersService.getActiveUsers());
    } catch (e) {
      this.logger.error(`Token update error: ${e.message}`);
      client.emit('error', { message: 'Invalid token' });
    }
  }

  sendActiveUsersList(client: Socket): void {
    client.emit('activeUsers', this.activeUsersService.getActiveUsers());
  }

  async handleCloseConnection(
    client: Socket,
    session_id: string,
  ): Promise<void> {
    if (session_id) {
      client.leave(session_id);
      this.logger.log(`Client ${client.id} left session ${session_id}`);
      client.emit('message', 'Socket connection closed');
    } else {
      this.logger.warn(
        `Invalid close connection request: sessionId=${session_id}`,
      );
      client.emit('error', 'Invalid sessionId');
    }
  }
}
