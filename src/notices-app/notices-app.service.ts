import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NoticesApp } from '../entities/notices-app.entity';
import { GetNoticesAppListDto, NoticesAppListResponse } from './dto/notices-app.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class NoticesAppService {
  constructor(
    @InjectRepository(NoticesApp)
    private noticesAppRepository: Repository<NoticesApp>,
    private dataSource: DataSource
  ) {}

  async getNoticesAppList(getNoticesAppListDto: GetNoticesAppListDto): Promise<{ success: boolean; data: NoticesAppListResponse[] | null; code: string }> {
    try {
      // 요청된 쿼리를 사용하여 데이터 조회
      const noticesAppList = await this.dataSource
        .createQueryBuilder()
        .select([
          'notices_type'
          , 'title'
          , 'content'
          , 'notices_app_id'
          , 'DATE_FORMAT(reg_dt, "%Y.%m.%d") AS reg_dt'
        ])
        .from('notices_app', 'na')
        .where('na.del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('na.view_yn = :view_yn', { view_yn: 'Y' })
        .andWhere('na.start_dt <= DATE_FORMAT(NOW(), "%Y%m%d%H%i%s")')
        .andWhere('na.end_dt >= DATE_FORMAT(NOW(), "%Y%m%d%H%i%s")')
        .orderBy('notices_app_id', 'DESC')
        .getRawMany();

      if (!noticesAppList || noticesAppList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: noticesAppList,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          code: COMMON_RESPONSE_CODES.FAIL
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}