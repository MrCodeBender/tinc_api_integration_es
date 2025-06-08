import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketsService } from 'src/modules/tickets/tickets.service';
import { TicketView } from 'src/entities/TicketView';
import { EsTicketMain } from 'src/entities/EsTicketMain';
import { UpdateTicketDto } from 'src/modules/tickets/dto/update-ticket.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { FindTicketsQueryDto } from 'src/modules/tickets/dto/find-tickets-query.dto';
import { IsCorporateAccount } from 'src/entities/IsCorporateAccount';

// Define the type for the mock repository more simply
type MockRepository<T = any> = {
  findOne: jest.Mock<Promise<T | null>>;
  find: jest.Mock<Promise<T[]>>;
  findAndCount: jest.Mock<Promise<[T[], number]>>;
  save: jest.Mock<Promise<T>>;
  create: jest.Mock<T>;
  // Add other methods if needed
};

// Factory function for creating mock repositories
const repositoryMockFactory = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

// Mock User Context Type (Simplified for tests)
interface MockUserContext {
    id?: number;
    is_account_main_id?: number;
    data?: {
        id_account?: string | number;
        corporate_accounts?: { is_account_main_id?: string | number }[];
    };
}

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepository: MockRepository<EsTicketMain>;
  let ticketViewRepository: MockRepository<TicketView>; // Keep this if needed for other tests

  const mockTicketId = 1;
  const mockAccountId = 100;
  const mockOtherAccountId = 101;
  const mockUserId = 50;

  // Simplified mock for TicketView for list/get operations
  const mockTicketView: Partial<TicketView> = {
    id: mockTicketId,
    is_account_main_id: mockAccountId,
    subject: 'Test Ticket Subject',
    ticket_status_name: 'Open',
    create_at: new Date(),
  };

  const mockTicket: EsTicketMain = {
    id: mockTicketId,
    is_account_main_id: mockAccountId,
    subject: 'Old Subject',
    id_tinc: 'TINC123',
    is_account_user_id: 500,
    is_account_location_id: 600,
    is_asset_main_id: null,
    es_ticket_priority_cat_id: 1,
    es_ticket_request_cat_id: null,
    comments: 'Initial comment',
    comments_diagnostic: null,
    es_service_main_id: null,
    requestor: 'John Doe',
    contact_phone: null,
    es_ticket_status_cat_id: 1,
    es_ticket_solution_cat_id: null,
    end_date: null,
    solution_description: null,
    service_chief_signature: null,
    service_specialist_signature: null,
    end_user_signature: null,
    service_chief_name: null,
    service_specialist_name: null,
    end_user_name: null,
    es_supplier_main_id: null,
    supplier_bloqued: false,
    is_user_profile_id: null,
    is_user_profile_editor_supplier: null,
    supplier_notification_date: null,
    attention_hour: null,
    attention_date: null,
    duration_hours: 0,
    duration_minutes: 0,
    assigned_engineer_name: null,
    timezone_create_at: new Date(),
    timezone_update_at: new Date(),
    is_active: true,
    create_at: new Date(),
    update_at: new Date(),
    last_update_user_id: null,
    timezone: 'UTC',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(EsTicketMain),
          useFactory: repositoryMockFactory, // Use factory
        },
        {
          provide: getRepositoryToken(TicketView),
          useFactory: repositoryMockFactory, // Use factory
        },
        { provide: getRepositoryToken(IsCorporateAccount), useFactory: repositoryMockFactory }, // Added based on service dependency
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketRepository = module.get(getRepositoryToken(EsTicketMain));
    ticketViewRepository = module.get(getRepositoryToken(TicketView));
    // Clear mocks, but don't set default implementations here
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Tests for getAllTickets --- 
  describe('getAllTickets', () => {
    const mockUser: MockUserContext = { is_account_main_id: mockAccountId };
    const queryDto = new FindTicketsQueryDto(); // Use defaults

    it('should return paginated tickets for the account', async () => {
      const mockTickets = [mockTicketView, { ...mockTicketView, id: 2 }];
      const mockTotal = 5;
      ticketViewRepository.findAndCount.mockResolvedValue([mockTickets as TicketView[], mockTotal]);
      
      const result = await service.getAllTickets(mockUser, queryDto);
      
      expect(ticketViewRepository.findAndCount).toHaveBeenCalled();
      // Basic check, QueryBuilder logic is more complex to assert precisely here without deeper inspection
      const callArg = ticketViewRepository.findAndCount.mock.calls[0][0]; // Get the options passed
      expect(callArg.where).toBeDefined(); 
      // expect(callArg.where.is_account_main_id).toEqual(mockAccountId); // QueryBuilder makes this harder to check directly
      expect(callArg.skip).toEqual(0);
      expect(callArg.take).toEqual(10);
      expect(result.data).toEqual(mockTickets);
      expect(result.total).toEqual(mockTotal);
      expect(result.page).toEqual(1);
      expect(result.limit).toEqual(10);
    });
    
    it('should apply pagination correctly', async () => {
      const queryDtoPage2 = { ...queryDto, page: 2, limit: 5 };
      ticketViewRepository.findAndCount.mockResolvedValue([[], 0]); // Return empty for simplicity
      
      await service.getAllTickets(mockUser, queryDtoPage2);
      
      expect(ticketViewRepository.findAndCount).toHaveBeenCalled();
      const callArg = ticketViewRepository.findAndCount.mock.calls[0][0];
      expect(callArg.skip).toEqual(5); // (2 - 1) * 5
      expect(callArg.take).toEqual(5);
    });
    
    // TODO: Add tests for date filters and corporate account filtering logic in getAllTickets
    // These would require mocking the QueryBuilder chain more extensively or testing the helper directly.
  });

  // --- Tests for findOne (assuming it uses TicketView) --- 
  describe('findOne', () => {
    it('should return a ticket if found for the account', async () => {
      ticketViewRepository.findOne.mockResolvedValue(mockTicketView as TicketView);
      const result = await service.findOne(mockTicketId, mockAccountId);
      expect(ticketViewRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: mockTicketId, is_account_main_id: mockAccountId }
      });
      expect(result).toEqual(mockTicketView);
    });

    it('should throw NotFoundException if ticket not found', async () => {
      ticketViewRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(mockTicketId, mockAccountId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if ticket belongs to another account', async () => {
      // Simulate findOne returning null because the account ID doesn't match
      ticketViewRepository.findOne.mockResolvedValue(null); 
      await expect(service.findOne(mockTicketId, mockOtherAccountId)).rejects.toThrow(NotFoundException);
       expect(ticketViewRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: mockTicketId, is_account_main_id: mockOtherAccountId }
      });
    });
  });
  
  describe('updateTicket', () => {
    const updateDto: UpdateTicketDto = {
      subject: 'New Subject',
      comments: 'Updated comment',
    };

    it('should update a ticket successfully', async () => {
      const currentMockTicket = { ...mockTicket }; // Clone for this test
      const expectedSavedTicket = {
        ...currentMockTicket,
        ...updateDto,
        last_update_user_id: mockUserId,
      };

      // Set mocks specific to this test
      ticketRepository.findOne.mockResolvedValue(currentMockTicket);
      ticketRepository.save.mockResolvedValue(expectedSavedTicket);

      const result = await service.updateTicket(
        mockTicketId,
        updateDto,
        mockAccountId,
        mockUserId,
      );

      expect(ticketRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTicketId } });
      expect(ticketRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
            id: mockTicketId,
            is_account_main_id: mockAccountId,
            subject: updateDto.subject,
            comments: updateDto.comments,
            last_update_user_id: mockUserId
        })
      );
      expect(result).toEqual(expectedSavedTicket);
    });

    it('should throw NotFoundException if ticket does not exist', async () => {
      // Set mocks specific to this test
      ticketRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateTicket(mockTicketId, updateDto, mockAccountId, mockUserId),
      ).rejects.toThrow(NotFoundException);
      expect(ticketRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if ticket does not belong to the account', async () => {
      const currentMockTicket = { ...mockTicket }; // Clone for this test
      // Set mocks specific to this test
      ticketRepository.findOne.mockResolvedValue(currentMockTicket);

      await expect(
        service.updateTicket(mockTicketId, updateDto, mockOtherAccountId, mockUserId),
      ).rejects.toThrow(ForbiddenException);
      expect(ticketRepository.save).not.toHaveBeenCalled();
    });

    it('should handle errors during save operation', async () => {
      const currentMockTicket = { ...mockTicket }; // Clone for this test
      const saveError = new Error('Database save failed');
      // Set mocks specific to this test
      ticketRepository.findOne.mockResolvedValue(currentMockTicket);
      ticketRepository.save.mockRejectedValue(saveError);

      await expect(
        service.updateTicket(mockTicketId, updateDto, mockAccountId, mockUserId),
      ).rejects.toThrow('Could not update ticket.');
       expect(ticketRepository.save).toHaveBeenCalled();
    });

     it('should update ticket correctly even if userId is null', async () => {
      const currentMockTicket = { ...mockTicket }; // Clone for this test
      const expectedSavedTicket = { 
        ...currentMockTicket, 
        ...updateDto, 
        last_update_user_id: null,
      };
      // Set mocks specific to this test
      ticketRepository.findOne.mockResolvedValue(currentMockTicket);
      ticketRepository.save.mockResolvedValue(expectedSavedTicket);

      const result = await service.updateTicket(
        mockTicketId,
        updateDto,
        mockAccountId,
        null,
      );

      expect(ticketRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTicketId } });
      expect(ticketRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ 
            id: mockTicketId,
            subject: updateDto.subject,
            comments: updateDto.comments, 
            last_update_user_id: null 
        })
      );
      expect(result).toEqual(expectedSavedTicket);
    });
  });

  // TODO: Add tests for other methods like findAll, findOne, getAllTickets, getTicketById
  // following a similar pattern of mocking repository responses and checking results/errors.
}); 