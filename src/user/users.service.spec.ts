import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      jest.spyOn(repo, 'findOne').mockResolvedValue(user as User);

      expect(await service.findByEmail('test@example.com')).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
      await expect(
        service.findByEmail('nonexistent@example.com'),
      ).rejects.toThrow(
        new NotFoundException(
          `User with email nonexistent@example.com not found`,
        ),
      );
    });
  });
});
