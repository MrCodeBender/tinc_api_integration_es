import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsAccountIntegrationAuth } from '../../src/entities/IsAccountIntegrationAuth';
import { Repository } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
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
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    authRepo = module.get<Repository<IsAccountIntegrationAuth>>(getRepositoryToken(IsAccountIntegrationAuth));
  });

  describe('login', () => {
    it('should return access token and user info on successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        is_account_main_id: '123',
      };

      const mockToken = 'mock.jwt.token';

      mockAuthRepo.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);
      mockConfigService.get.mockReturnValue('secret');

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        access_token: mockToken,
      });
      expect(mockAuthRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockAuthRepo.findOne.mockResolvedValue(null);

      await expect(
        controller.login({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('protected', () => {
    it('should return protected resource with user info', () => {
      const mockUser = {
        userId: 1,
        email: 'test@example.com',
        is_account_main_id: '123',
      };

      const mockRequest = {
        user: mockUser,
      };

      const result = controller.getProtectedResource(mockRequest);

      expect(result).toEqual({
        message: 'Ruta protegida con JWT',
        user: mockUser,
      });
    });
  });

  describe('protected-api', () => {
    it('should return protected resource with user info for API key', () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        is_account_main_id: '123',
      };

      const mockRequest = {
        user: mockUser,
      };

      const result = controller.getProtectedApiResource(mockRequest);

      expect(result).toEqual({
        message: 'Ruta protegida con API Key',
        user: mockUser,
      });
    });
  });
}); 