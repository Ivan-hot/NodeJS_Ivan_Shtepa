import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { Message } from './entity/message.entity';
import { PostMessageDto } from './dto/post-message.dto';
import { User } from 'src/user/entity/user.entity';
import { Session } from './entity/session.entity';
import { InitSessionDto } from './dto/init-session.dto';
import { MessageResponseDto } from './/dto/message-response.dto';
import { Logger } from '@nestjs/common';
import { UserParticipantDto } from 'src/user/dto/user-participant.dto';
import { isUUID } from 'class-validator';
import { InvalidUUIDException } from '../messages/utils/messages-error-response.util';
import { UserGroup } from 'src/user/entity/user-group.entity';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}

  async initializeSession(
    initSessionDto: InitSessionDto,
    user_id: number,
  ): Promise<Session> {
    if (!user_id) {
      this.logger.error('User ID is missing');
      throw new BadRequestException('User ID is not provided');
    }

    const { session_name, is_private, participants } = initSessionDto;

    let session = await this.sessionRepository.findOne({
      where: { session_name, is_private },
    });

    let userEntities: User[] = [];

    if (!session) {
      const uniqueParticipants = new Set([...participants, user_id]);

      userEntities = await this.userRepository.findByIds(
        Array.from(uniqueParticipants),
      );

      if (userEntities.length === 0) {
        this.logger.error('No users found for the given participants');
        throw new BadRequestException('No users found for the given participants');
      }

      session = this.sessionRepository.create({
        session_name,
        is_private,
        participants: userEntities,
      });
      session = await this.sessionRepository.save(session);

      this.logger.log(`Session initialized for user ${user_id}`);
    } else {
      userEntities = session.participants || [];
    }

    const userGroupEntities = userEntities.map((user) => {
      return this.userGroupRepository.create({
        user: user, 
        session: session,
        is_creator: user.id === user_id,
      });
    });

    await this.userGroupRepository.save(userGroupEntities);

    this.logger.log(
      `User groups created for session "${session.session_name}"`,
    );

    return session;
  }

  async create(
    postMessageDto: PostMessageDto,
    senderId: number,
  ): Promise<{ message: Message; participants: UserParticipantDto[] }> {
    const { session_id, message_text, receiver_id } = postMessageDto;

    const session = await this.sessionRepository.findOne({
      where: { id: session_id },
      relations: ['participants'],
    });

    if (
      !session ||
      !session.participants.some((user) => user.id === senderId)
    ) {
      this.logger.warn(
        `User ${senderId} is not a participant of session ${session_id}`,
      );
      throw new NotFoundException(
        'Sender is not a participant of this session',
      );
    }

    const message = this.messagesRepository.create({
      session,
      message_text,
      sender: { id: senderId } as User,
      receiver: receiver_id ? ({ id: receiver_id } as User) : null,
      is_public: !receiver_id,
    });

    const savedMessage = await this.messagesRepository.save(message);

    const participants = session.participants.map((user) => {
      const userDto = new UserParticipantDto();
      userDto.id = user.id;
      userDto.nick_name = user.nick_name;
      return userDto;
    });

    this.logger.log(`Message created successfully by user ${senderId}`);

    return { message: savedMessage, participants };
  }

  async updateMessageWithQueryBuilder(
    messageId: string,
    newText: string,
  ): Promise<void> {
    if (!newText) {
      throw new Error('New message text is required');
    }

    const result = await this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ message_text: newText })
      .where('id = :id', { id: messageId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Message with id ${messageId} not found`);
    }
  }

  async findAllBySessionId(session_id: string): Promise<Message[]> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id },
      relations: ['messages'],
    });
    if (!isUUID(session_id) || !session) {
      throw new NotFoundException(`Session with id ${session_id} not found`);
    }
    return session.messages;
  }

  async searchMessages(
    session_id: string,
    searchString: string,
  ): Promise<Message[]> {
    return this.messagesRepository.find({
      where: {
        session: { id: session_id },
        message_text: Like(`%${searchString}%`),
      },
      order: { created_at: 'ASC' },
      relations: ['sender', 'session'],
    });
  }

  async addUserToPublicSession(
    session_id: string,
    user_id: number,
  ): Promise<UserParticipantDto[]> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id, is_private: false },
      relations: ['participants'],
    });

    if (!this.isUUIDValid(session_id)) {
      throw new InvalidUUIDException('sessionId', session_id);
    }

    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found.`);
    }

    if (!session) {
      throw new NotFoundException(
        `Public session with id ${session_id} not found`,
      );
    }

    const userAlreadyInSession = session.participants.some(
      (user) => user.id === user_id,
    );
    if (userAlreadyInSession) {
      throw new BadRequestException('User is already in the public session');
    }

    session.participants.push({ id: user_id } as User);
    const updatedSession = await this.sessionRepository.save(session);

    return updatedSession.participants.map((user) => {
      const userDto = new UserParticipantDto();
      userDto.id = user.id;
      userDto.nick_name = user.nick_name;
      return userDto;
    });
  }

  async addUserToPrivateGroup(
    session_id: string,
    user_id: number,
    requestor_id: number,
  ): Promise<UserParticipantDto[]> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id, is_private: true },
      relations: ['participants'],
    });

    if (!session) {
      throw new NotFoundException(
        `Private session with id ${session_id} not found`,
      );
    }

    const requestorInSession = session.participants.some(
      (user) => user.id === requestor_id,
    );
    if (!requestorInSession) {
      throw new ForbiddenException(
        'You are not a participant of this private session',
      );
    }

    const userAlreadyInSession = session.participants.some(
      (user) => user.id === user_id,
    );
    if (userAlreadyInSession) {
      throw new BadRequestException(
        'User is already a participant of this private session',
      );
    }

    session.participants.push({ id: user_id } as User);
    const updatedSession = await this.sessionRepository.save(session);

    return updatedSession.participants.map((user) => {
      const userDto = new UserParticipantDto();
      userDto.id = user.id;
      userDto.nick_name = user.nick_name;
      return userDto;
    });
  }

  async removeUserFromSession(
    session_id: string,
    user_id: number,
  ): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id },
      relations: ['participants'],
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${session_id} not found`);
    }

    if (session.is_private) {
      throw new ForbiddenException(
        'Cannot remove a user from a private session',
      );
    }

    const userInSession = session.participants.some(
      (user) => user.id === user_id,
    );
    if (!userInSession) {
      throw new NotFoundException('User is not a participant of this session');
    }

    session.participants = session.participants.filter(
      (user) => user.id !== user_id,
    );

    return await this.sessionRepository.save(session);
  }

  async getActiveUsersInSession(session_id: string): Promise<User[]> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id },
      relations: ['participants'],
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${session_id} not found`);
    }

    return session.participants;
  }

  async findPublicMessages(skip: number, take: number): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { is_public: true },
      order: { created_at: 'DESC' },
      skip,
      take,
      relations: ['sender'],
    });
  }

  async findPrivateMessages(
    user_id: number,
    contactId: number,
    skip: number,
    take: number,
  ): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        {
          sender: { id: user_id },
          receiver: { id: contactId },
          is_public: false,
        },
        {
          sender: { id: contactId },
          receiver: { id: user_id },
          is_public: false,
        },
      ],
      order: { created_at: 'DESC' },
      skip,
      take,
      relations: ['sender', 'receiver'],
    });
  }

  async getMessageHistory(
    session_id: string,
    user_id: number,
    contactId?: number,
    is_public?: boolean,
    skip: number = 0,
    take: number = 50,
  ): Promise<MessageResponseDto[]> { // Promise<Partial<Message>[]> {

    await this.validateSession(session_id);

    if (is_public !== undefined && typeof is_public !== 'boolean') {
      throw new BadRequestException(`Invalid value for is_public: "${is_public}". Must be true or false.`);
    }
    
    const options: FindManyOptions<Message> = {
      order: { created_at: 'DESC' },
      skip,
      take,
      relations: ['sender', 'receiver', 'session'],
      where: { session: { id: session_id } },
    };

    if (is_public !== undefined) {
      options.where = { ...options.where, is_public };
    }

    if (!is_public && contactId) {
      options.where = [
        {
          ...options.where,
          sender: { id: user_id },
          receiver: { id: contactId },
        },
        {
          ...options.where,
          sender: { id: contactId },
          receiver: { id: user_id },
        },
      ];
    }

    const messages = await this.messagesRepository.find(options);

    return messages.map((message) => ({
      id: message.id,
      message_text: message.message_text,
      is_public: message.is_public,
      created_at: message.created_at,
      sender: {
        id: message.sender.id,
        nick_name: message.sender.nick_name,
      },
      receiver: message.receiver
        ? {
            id: message.receiver.id,
            nick_name: message.receiver.nick_name,
          }
        : null,
      session: {
        id: message.session.id,
        session_name: message.session.session_name,
      },
    }));
  }

  async validateSession(session_id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id: session_id } });

    if (!session) {
      throw new NotFoundException(`Session with id "${session_id}" not found`);
    }

    return session;
  }

  private isUUIDValid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
