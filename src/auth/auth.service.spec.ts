import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Logger, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('token'),
      verify: jest.fn(),
    };

    // Мок для bcrypt.compare
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    // Мок для Logger.error, щоб уникнути записів у лог під час тестів
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return null if user is not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens', async () => {
      const user = { email: 'test@example.com', id: 1 };
      const tokens = await service.login(user);
      expect(tokens).toEqual({
        access_token: 'token',
        refresh_token: 'token',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token if refresh token is valid', async () => {
      const payload = { username: 'test@example.com', sub: 1 };
      (jwtService.verify as jest.Mock).mockReturnValue(payload);
      (jwtService.sign as jest.Mock).mockReturnValue('newToken');

      const tokens = await service.refreshToken('validRefreshToken');
      expect(tokens).toEqual({
        access_token: 'newToken',
      });
      expect(jwtService.verify).toHaveBeenCalledWith('validRefreshToken');
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: payload.username,
        sub: payload.sub,
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalidRefreshToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
