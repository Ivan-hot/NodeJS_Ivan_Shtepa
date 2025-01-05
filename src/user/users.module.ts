
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { UsersController } from './users.controller'; 
import { ActiveUsersService } from './active-users.service'
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User])
  , forwardRef(() => AuthModule)
],
  providers: [UsersService, ActiveUsersService],
  controllers: [UsersController],
  exports: [UsersService, ActiveUsersService],
})
export class UsersModule {}
