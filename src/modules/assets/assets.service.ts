import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetView } from '../../entities/AssetView';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(AssetView)
    private assetsRepository: Repository<AssetView>,
  ) {}

  async findAll(es_account_main_id: number): Promise<AssetView[]> {
    return this.assetsRepository.find({ where: { es_account_main_id } });
  }
} 