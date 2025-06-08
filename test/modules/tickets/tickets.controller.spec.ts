import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from 'src/modules/tickets/tickets.controller';
import { TicketsService } from 'src/modules/tickets/tickets.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateTicketDto } from 'src/modules/tickets/dto/update-ticket.dto';
import { EsTicketMain } from 'src/entities/EsTicketMain';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

// Mock TicketsService
const mockTicketsService = {
  updateTicket: jest.fn(),
  findOne: jest.fn(), // Mock other methods if needed for other tests
  findAll: jest.fn(),
  getAllTickets: jest.fn(),
  getTicketById: jest.fn(), 
};

// Mock JwtAuthGuard
const mockJwtAuthGuard = {
  canActivate: jest.fn((context: ExecutionContext) => {
    // Simulate guard allowing access
    const req = context.switchToHttp().getRequest();
    // Attach a mock user object if it doesn't exist
    if (!req.user) {
      req.user = { id: 1, is_account_main_id: 100 }; 
    }
    return true;
  }),
};

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: typeof mockTicketsService;

  const mockTicketId = 1;
  const mockAccountId = 100;
  const mockUserId = 1;
  const mockUpdateDto: UpdateTicketDto = {
    subject: 'Updated Subject via Controller',
  };
  const mockUpdatedTicket: EsTicketMain = {
    id: mockTicketId,
    is_account_main_id: mockAccountId,
    subject: mockUpdateDto.subject ?? 'Default Subject',
    // Populate other EsTicketMain fields as needed for a valid return object
    id_tinc: 'TINC456', is_account_user_id: 501, is_account_location_id: 601, is_asset_main_id: null, 
    es_ticket_priority_cat_id: 1, es_ticket_request_cat_id: null, comments: null, comments_diagnostic: null, 
    es_service_main_id: null, requestor: 'Jane Doe', contact_phone: null, es_ticket_status_cat_id: 2, 
    es_ticket_solution_cat_id: null, end_date: null, solution_description: null, service_chief_signature: null,
    service_specialist_signature: null, end_user_signature: null, service_chief_name: null, service_specialist_name: null,
    end_user_name: null, es_supplier_main_id: null, supplier_bloqued: false, is_user_profile_id: mockUserId, 
    is_user_profile_editor_supplier: null, supplier_notification_date: null, attention_hour: null, attention_date: null, 
    duration_hours: 0, duration_minutes: 0, assigned_engineer_name: null, timezone_create_at: new Date(), 
    timezone_update_at: new Date(), is_active: true, create_at: new Date(), update_at: new Date(), 
    last_update_user_id: mockUserId, timezone: 'UTC'
  };
  
  const mockRequest = {
    user: {
      id: mockUserId,
      is_account_main_id: mockAccountId,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    })
    // Override the guard globally for this test module
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get(TicketsService);

    // Reset mocks before each test
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateTicket (PATCH :id)', () => {
    it('should call TicketsService.updateTicket and return the updated ticket', async () => {
      service.updateTicket.mockResolvedValue(mockUpdatedTicket);

      const result = await controller.updateTicket(
        mockTicketId,
        mockUpdateDto,
        mockRequest, // Pass the mock request containing user info
      );

      expect(service.updateTicket).toHaveBeenCalledTimes(1);
      expect(service.updateTicket).toHaveBeenCalledWith(
        mockTicketId,
        mockUpdateDto,
        mockAccountId, // Extracted from mockRequest.user
        mockUserId, // Extracted from mockRequest.user
      );
      expect(result).toEqual(mockUpdatedTicket);
    });

    it('should throw ForbiddenException if accountId is missing in token', async () => {
       const requestWithoutAccountId = {
        user: { id: mockUserId }, // Missing is_account_main_id
      };

      // We don't need to mock the service call as the controller should throw before calling it.
      await expect(
        controller.updateTicket(mockTicketId, mockUpdateDto, requestWithoutAccountId),
      ).rejects.toThrow(ForbiddenException);
      expect(service.updateTicket).not.toHaveBeenCalled();
    });

    it('should forward NotFoundException from service', async () => {
        const error = new NotFoundException(`Ticket with ID ${mockTicketId} not found.`);
        service.updateTicket.mockRejectedValue(error);

        await expect(
            controller.updateTicket(mockTicketId, mockUpdateDto, mockRequest),
        ).rejects.toThrow(NotFoundException);
        expect(service.updateTicket).toHaveBeenCalledWith(mockTicketId, mockUpdateDto, mockAccountId, mockUserId);
    });

    it('should forward ForbiddenException from service', async () => {
        const error = new ForbiddenException('You do not have permission...');
        service.updateTicket.mockRejectedValue(error);

        await expect(
            controller.updateTicket(mockTicketId, mockUpdateDto, mockRequest),
        ).rejects.toThrow(ForbiddenException);
         expect(service.updateTicket).toHaveBeenCalledWith(mockTicketId, mockUpdateDto, mockAccountId, mockUserId);
    });

     it('should handle other errors from service', async () => {
        const genericError = new Error('Some internal service error');
        service.updateTicket.mockRejectedValue(genericError);

        await expect(
            controller.updateTicket(mockTicketId, mockUpdateDto, mockRequest),
        ).rejects.toThrow(Error); // Expect a generic error
        expect(service.updateTicket).toHaveBeenCalledWith(mockTicketId, mockUpdateDto, mockAccountId, mockUserId);
    });
  });

  // TODO: Add tests for other controller endpoints (getAllTickets, getTicketById)
  // following a similar pattern: mock service responses, check controller calls, verify results/errors.
}); 