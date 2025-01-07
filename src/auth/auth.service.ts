import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from 'src/user/entity/user-group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    this.logger.log(`Login attempt for email: ${email}`);
    const user = await this.validateUser(email, password);
    
    if (!user) {
      this.logger.warn(`User not found or invalid credentials: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const userGroups = await this.userGroupRepository.find({
      where: { user: { id: user.id } },
      relations: ['session'],
    });
  
    const groupInfo = userGroups.map((group) => ({
      session_id: group.session.id,
      session_name: group.session.session_name,
      is_private: group.session.is_private,
      is_creator: group.is_creator,
    }));

    this.logger.log(`Login successful for email: ${email}`);
    return this.generateTokens(user);
  }

  async validateUser(email: string, hashedPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`User not found for email: ${email}`);
      return null;
    }

    if (user.password !== hashedPassword) {
      this.logger.warn(`Invalid hashed password for email: ${email}`);
      return null;
    }
    return user;
  }

  generateTokens(user: any) {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });

    this.logger.log(`Tokens generated for user ID: ${user.id}`);
    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    try {
      const { username, sub } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const user = await this.usersService.findById(sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      this.logger.log(`Token refreshed for user ID: ${user.id}`);
      return this.generateTokens(user);
    } catch (error) {
      this.logger.warn(`Invalid refresh token`);
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }

  async updatePassword(updateUserDto: UpdateUserDto, user: any) {
    const { oldPassword, newPassword } = updateUserDto;
  
    if (!user?.sub) {
      this.logger.error(`User ID is missing in updatePassword`);
      throw new UnauthorizedException('User ID is missing');
    }
  
    this.logger.log(`Updating password for user ID: ${user.sub}`);
  
    const existingUser = await this.usersService.findById(user.sub);
    if (!existingUser || existingUser.password !== oldPassword) {
      this.logger.warn(`Invalid old password for user ID: ${user.sub}`);
      throw new UnauthorizedException('Old password is incorrect');
    }
  
    await this.usersService.updateUserPassword(user.sub, newPassword);
    this.logger.log(`Password successfully updated for user ID: ${user.sub}`);
    return { message: 'Password successfully updated' };
  }
  
}
