import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ActiveUsersService } from './active-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly activeUsersService: ActiveUsersService,
  ) {
    this.logger.log('UsersController initialized');
  }

  @Post('/register')
  @ApiOperation({ summary: 'registration of new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully registered.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or password or email already in use.',
  })

async register(@Body() createUserDto: CreateUserDto) {
  this.logger.log(`Registration request with email: ${createUserDto.email}`);
  await this.usersService.register(createUserDto);
  this.logger.log(`User with email ${createUserDto.email} successfully registered`);
  return { message: 'User successfully registered' };
}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({
    status: 200,
    description: 'List of users with nickName and id.',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid or missing token.',
  })
  async getUsers() {
    this.logger.log('Fetching list of users');
    const users = await this.usersService.findAll();
    this.logger.log(`Fetched users: ${JSON.stringify(users)}`);
    return users;
  }
}
