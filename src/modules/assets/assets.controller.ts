import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { AssetView } from '../../entities/AssetView';
import { JwtOrApiKeyAuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser, AuthenticatedUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtOrApiKeyAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of assets' })
  @ApiResponse({ status: 200, description: 'List of assets retrieved successfully.', type: [AssetView] })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.assetsService.findAll(user.es_account_main_id);
  }
} 