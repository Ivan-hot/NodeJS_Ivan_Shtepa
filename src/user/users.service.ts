import { Injectable, NotFoundException, HttpException, HttpStatus, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByNickName(nick_name: string): Promise<User | undefined> {
    const where: FindOptionsWhere<User> = { nick_name };
    return this.usersRepository.findOne({ where });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByIds(ids: number[]): Promise<User[]> {
    return this.usersRepository.find({
      where: { id: In(ids) },
      select: ['id', 'email', 'created_at'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    const userExists = await this.findByEmail(createUserDto.email);
    if (userExists) {
      throw new HttpException('Email is already in use', HttpStatus.BAD_REQUEST);
    }
    await this.create(createUserDto);
  }
  

  async updateUserPassword(user_id: number, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(user_id, { password: hashedPassword });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ select: ['id', 'nick_name'] });
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
