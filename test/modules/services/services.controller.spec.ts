import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from '../../../src/modules/services/services.controller';
import { ServicesService } from '../../../src/modules/services/services.service';
import { ServiceView } from '../../../src/entities/ServiceView';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;
  let serviceRepo: Repository<ServiceView>;

  const mockServiceRepo = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  const mockServicesService = {
    getAllServices: jest.fn(),
    getServiceById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(ServiceView),
          useValue: mockServiceRepo,
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
    serviceRepo = module.get<Repository<ServiceView>>(getRepositoryToken(ServiceView));
  });

  describe('getAllServices', () => {
    it('should return paginated services', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'Service 1',
          description: 'Description 1',
          is_account_main_id: '123',
        },
        {
          id: 2,
          name: 'Service 2',
          description: 'Description 2',
          is_account_main_id: '123',
        },
      ];

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        is_account_main_id: '123',
      };

      mockServicesService.getAllServices.mockResolvedValue({
        data: mockServices,
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await controller.getAllServices(1, 10, mockUser);

      expect(result).toEqual({
        data: mockServices,
        total: 2,
        page: 1,
        limit: 10,
      });
      expect(mockServicesService.getAllServices).toHaveBeenCalledWith(1, 10, '123');
    });
  });

  describe('getServiceById', () => {
    it('should return a service by id', async () => {
      const mockService = {
        id: 1,
        name: 'Service 1',
        description: 'Description 1',
        is_account_main_id: '123',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        is_account_main_id: '123',
      };

      mockServicesService.getServiceById.mockResolvedValue(mockService);

      const result = await controller.getServiceById(1, mockUser);

      expect(result).toEqual(mockService);
      expect(mockServicesService.getServiceById).toHaveBeenCalledWith(1, '123');
    });

    it('should throw NotFoundException when service is not found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        is_account_main_id: '123',
      };

      mockServicesService.getServiceById.mockResolvedValue(null);

      await expect(controller.getServiceById(999, mockUser)).rejects.toThrow(
        'Service not found',
      );
    });
  });
}); 