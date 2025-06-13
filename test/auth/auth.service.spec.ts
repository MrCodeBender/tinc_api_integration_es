import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsAccountIntegrationAuth } from '../../src/entities/EsAccountIntegrationAuth';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let authRepo: Repository<IsAccountIntegrationAuth>;

  const mockAuthRepo = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(IsAccountIntegrationAuth),
          useValue: mockAuthRepo,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    authRepo = module.get<Repository<IsAccountIntegrationAuth>>(getRepositoryToken(IsAccountIntegrationAuth));
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        is_account_main_id: '123',
      };

      mockAuthRepo.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(mockAuthRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockAuthRepo.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser('invalid@example.com', 'password123'),
      ).rejects.toThrow('Credenciales inválidas');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        is_account_main_id: '123',
      };

      mockAuthRepo.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        is_account_main_id: '123',
      };

      const mockToken = 'mock.jwt.token';

      mockJwtService.sign.mockReturnValue(mockToken);
      mockConfigService.get.mockReturnValue('secret');

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
          is_account_main_id: mockUser.is_account_main_id,
        },
        { secret: 'secret' },
      );
    });
  });

  describe('validateApiKey', () => {
    it('should return user when API key is valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        api_key: 'valid-api-key',
        is_account_main_id: '123',
      };

      mockAuthRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.validateApiKey('valid-api-key');

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        is_account_main_id: mockUser.is_account_main_id,
      });
      expect(mockAuthRepo.findOne).toHaveBeenCalledWith({
        where: { api_key: 'valid-api-key' },
      });
    });

    it('should throw UnauthorizedException when API key is invalid', async () => {
      mockAuthRepo.findOne.mockResolvedValue(null);

      await expect(service.validateApiKey('invalid-api-key')).rejects.toThrow(
        'API Key inválida',
      );
    });
  });
}); 