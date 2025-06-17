import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NoticesShoppingApp } from '../entities/notices-shopping-app.entity';

@Injectable()
export class NoticesShoppingAppService {
  constructor(
    @InjectRepository(NoticesShoppingApp)
    private noticesShoppingAppRepository: Repository<NoticesShoppingApp>,
    private dataSource: DataSource
  ) {}

  // 메소드는 나중에 추가 예정
} 