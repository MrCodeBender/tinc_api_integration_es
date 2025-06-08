import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from '../../../src/modules/services/services.service';
import { ServiceView } from '../../../src/entities/ServiceView';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let serviceRepo: Repository<ServiceView>;

  const mockServiceRepo = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(ServiceView),
          useValue: mockServiceRepo,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    serviceRepo = module.get<Repository<ServiceView>>(getRepositoryToken(ServiceView));
  });

  describe('getAllServices', () => {
    it('should return paginated services filtered by is_account_main_id', async () => {
      const mockServices = [
        {
          id: 1,
          name: 'Service 1',
          description: 'Description 1',
          is_account_main_id: 123,
        },
        {
          id: 2,
          name: 'Service 2',
          description: 'Description 2',
          is_account_main_id: 123,
        },
      ];

      mockServiceRepo.findAndCount.mockResolvedValue([mockServices, 2]);

      const result = await service.getAllServices(1, 10, 123);

      expect(result).toEqual({
        data: mockServices,
        total: 2,
        page: 1,
        limit: 10,
      });
      expect(mockServiceRepo.findAndCount).toHaveBeenCalledWith({
        where: { is_account_main_id: 123 },
        skip: 0,
        take: 10,
      });
    });

    it('should return empty array when no services found', async () => {
      mockServiceRepo.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.getAllServices(1, 10, 999);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('getServiceById', () => {
    it('should return a service by id filtered by is_account_main_id', async () => {
      const mockService = {
        id: 1,
        name: 'Service 1',
        description: 'Description 1',
        is_account_main_id: 123,
      };

      mockServiceRepo.findOne.mockResolvedValue(mockService);

      const result = await service.getServiceById(1, 123);

      expect(result).toEqual(mockService);
      expect(mockServiceRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, is_account_main_id: 123 },
      });
    });

    it('should throw NotFoundException when service is not found', async () => {
      mockServiceRepo.findOne.mockResolvedValue(null);

      await expect(service.getServiceById(999, 123)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when service belongs to different account', async () => {
      const mockService = {
        id: 1,
        name: 'Service 1',
        description: 'Description 1',
        is_account_main_id: 456, // Different from requested
      };

      mockServiceRepo.findOne.mockResolvedValue(mockService);

      await expect(service.getServiceById(1, 123)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
}); 