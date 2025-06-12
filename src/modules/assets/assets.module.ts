import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { AssetView } from '../../entities/AssetView';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetView]),
    AuthModule
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {} 