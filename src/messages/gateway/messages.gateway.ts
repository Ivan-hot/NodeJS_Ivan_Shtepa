import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../../socket/socket.service'; 
import { PostMessageDto } from '../dto/post-message.dto';
import { ActiveUsersService } from 'src/user/active-users.service';
import { MessagesService } from '../messages.service';

@WebSocketGateway({
  cors: {
    cors: true,
    namespace: '/messages',
    maxHttpBufferSize: 1e6,
  },
})
@Injectable()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
   server: Server;

  private readonly logger = new Logger('MessagesGateway');

  constructor(
    private readonly socketService: SocketService,
    private readonly activeUsersService: ActiveUsersService,
    private readonly messagesService: MessagesService,
  ) {}

  afterInit(server: Server) {
    this.socketService.initializeServer(server);
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      await this.socketService.handleClientConnection(client);
    } catch (e) {
      this.logger.error(`Error during client connection: ${e.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.socketService.removeSubscription(client);
  }

  @SubscribeMessage('sendMessage')
async handleMessage(
  @MessageBody() data: PostMessageDto,
  @ConnectedSocket() client: Socket,
) {
  const user = client.data.user;
  if (!user) {
    throw new UnauthorizedException('User not authorized');
  }

  const sender_id = user.sub;
  const result = await this.messagesService.create(data, sender_id);

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

  this.logger.log(`User ${sender_id} sent message: ${data.message_text}`);
}


  @SubscribeMessage('updateToken')
  async handleUpdateToken(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    await this.socketService.handleTokenUpdate(client, data);
  }

  @SubscribeMessage('getActiveUsers')
  async handleGetActiveUsers(@ConnectedSocket() client: Socket) {
    this.socketService.sendActiveUsersList(client);
  }

  @SubscribeMessage('close-connection')
  async handleCloseConnection(
    @MessageBody() data: { session_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.socketService.handleCloseConnection(client, data.session_id);
  }

  async sendMessageToSession(session_id: string) {
    const messages = await this.messagesService.findAllBySessionId(session_id);
    this.server.to(session_id).emit('new-message', messages);
  }
}
