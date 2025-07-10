import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventApp } from '../entities/event-app.entity';

@Injectable()
export class EventAppService {
  constructor(
    @InjectRepository(EventApp)
    private eventRepository: Repository<EventApp>,
    private dataSource: DataSource
  ) {}

  async getEventAppList(event_app_id: number): Promise<{ success: boolean; data: any | null; code: string }> {
    try {
      const targetEvent = await this.dataSource
        .createQueryBuilder()
        .select([
          'ea.event_app_id'
          , 'ea.title'
          , 'eai.event_img_type'
          , 'eai.navigation_path'
          , 'cf.file_id'
          , 'cf.file_name'
          , 'cf.file_path'
          , 'cf.file_division'
        ])
        .from('event_app', 'ea')
        .leftJoin('event_app_img', 'eai', 'ea.event_app_id = eai.event_app_id')
        .leftJoin('common_file', 'cf', 'eai.file_id = cf.file_id')
        .where('ea.event_app_id = :event_app_id', { event_app_id })
        .andWhere('ea.use_yn = :use_yn', { use_yn: 'Y' })
        .andWhere('ea.del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('eai.del_yn = :del_yn', { del_yn: 'N' })
        .getRawMany();

      return {
        success: true,
        data: targetEvent,
        code: 'SUCCESS'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        code: 'FAIL'
      };
    }
  }

  // 메소드는 나중에 추가 예정
} 