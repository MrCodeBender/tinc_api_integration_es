import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { AssetView } from '../../entities/AssetView';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthView } from '../../entities/AuthView';

@ApiTags('Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of assets' })
  @ApiResponse({ status: 200, description: 'List of assets retrieved successfully.', type: [AssetView] })
  findAll(@CurrentUser() user: AuthView) {
    if (!user.es_account_main_id) {
      throw new UnauthorizedException('User does not have a primary account associated.');
    }
    return this.assetsService.findAll(user.es_account_main_id);
  }
} 