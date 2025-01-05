import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  UseGuards,
  Param,
  Request,
  ParseIntPipe,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostMessageDto } from './dto/post-message.dto';
import { InitSessionDto } from './dto/init-session.dto';
import { MessageRoutesEnum } from './routes/messages.routes.enum';
import { RequireAuth } from './decorators/require-auth.decorator';
import { isUUID } from 'class-validator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MessageResponseDto } from './dto/message-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {

  constructor(
    private readonly messagesService: MessagesService,
  ) {}

  @Post(MessageRoutesEnum.INIT)
  @ApiOperation({ summary: 'Initialize socket connection for a session' })
  @ApiResponse({ status: 201, description: 'Socket connection initialized' })
  async initSocketConnection(@Body() initSessionDto: InitSessionDto, @Request() req) {
    const user_id = req.user?.sub;
    return this.messagesService.initializeSession(initSessionDto, user_id);
  }

  @Post(MessageRoutesEnum.POST_MESSAGE)
  @ApiOperation({ summary: 'Post a new message to a session' })
  async createMessage(@Body() postMessageDto: PostMessageDto, @Request() req) {
    const senderId = req.user.sub;
    return this.messagesService.create(postMessageDto, senderId);
  }

  @Get(MessageRoutesEnum.GET_MESSAGES)
@ApiOperation({ summary: 'Get chat messages by session_id' })
@ApiQuery({ name: 'session_id', type: String, required: true, description: 'UUID of the session' })
@ApiQuery({ name: 'is_public', type: Boolean, required: true, description: 'Filter by public status' })
@ApiResponse({
  status: 200,
  description: 'List of chat messages',
  type: [MessageResponseDto],
})
async getMessages(
  @Query('session_id') session_id: string,
  @Query('is_public') is_public: string | undefined,
  @RequireAuth() user,
): Promise<MessageResponseDto[]> {
  const isPublicBoolean = is_public ? is_public === 'true' : undefined;

  const messages = await this.messagesService.getMessageHistory(session_id, user.sub, undefined, isPublicBoolean);

  return messages;
}


@Get(MessageRoutesEnum.ACTIVE_USERS)
@ApiOperation({ summary: 'Get active users in a session' })
@ApiParam({
  name: 'session_id',
  type: String,
  required: true,
  description: 'UUID of the session',
})
@ApiResponse({
  status: 200,
  description: 'List of active users in the session',
  type: [UserResponseDto],
})
async getActiveUsersInSession(@Param('session_id') session_id: string): Promise<UserResponseDto[]> {
  if (!isUUID(session_id)) {
    throw new NotFoundException(`Session with id ${session_id} not found`);
  }
  const users = await this.messagesService.getActiveUsersInSession(session_id);

  return users.map((user) => ({
    id: user.id,
    nick_name: user.nick_name,
  }));
}



  @Get(MessageRoutesEnum.PRIVATE_MESSAGES)
  @ApiOperation({ summary: 'Get private chat messages' })
  async getPrivateMessages(
    @Query('receiver_id') receiver_id: number,
    @RequireAuth() user,
    @Query('skip') skip = 0,
    @Query('take') take = 50
  ) {
    return this.messagesService.findPrivateMessages(user.sub, receiver_id, skip, take);
  }

  @Patch(MessageRoutesEnum.ADD_USER_TO_PUBLIC)
@ApiOperation({ summary: 'Add a user to a public chat session' })
async addUserToSession(@Param('session_id') session_id: string, @Query('user_id', ParseIntPipe) user_id: number) {
  return this.messagesService.addUserToPublicSession(session_id, user_id);
}

@Patch(MessageRoutesEnum.ADD_USER_TO_PRIVATE)
@ApiOperation({ summary: 'Add a user to a private group' })
async addUserToPrivateGroup(
  @Param('session_id') session_id: string,
  @Query('user_id', ParseIntPipe) user_id: number,
  @RequireAuth() user,
) {
  return this.messagesService.addUserToPrivateGroup(session_id, user_id, user.sub);
}

@Patch(MessageRoutesEnum.REMOVE_USER)
@ApiOperation({ summary: 'Remove a user from a public chat session' })
async removeUserFromSession(@Param('session_id') session_id: string, @Query('user_id', ParseIntPipe) user_id: number) {
  await this.messagesService.removeUserFromSession(session_id, user_id);
    return {};
  }
}
