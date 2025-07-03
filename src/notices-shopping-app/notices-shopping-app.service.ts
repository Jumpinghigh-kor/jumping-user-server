import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NoticesShoppingApp } from '../entities/notices-shopping-app.entity';
import { GetNoticesShoppingAppListDto, NoticesShoppingAppListResponse } from './dto/notices-shopping-app.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class NoticesShoppingAppService {
  constructor(
    @InjectRepository(NoticesShoppingApp)
    private noticesShoppingAppRepository: Repository<NoticesShoppingApp>,
    private dataSource: DataSource
  ) {}

  async getNoticesShoppingAppList(getNoticesShoppingAppListDto: GetNoticesShoppingAppListDto): Promise<{ success: boolean; data: NoticesShoppingAppListResponse[] | null; code: string }> {
    try {
      const { notices_type } = getNoticesShoppingAppListDto;
      
      const queryBuilder = this.dataSource
        .createQueryBuilder()
        .select([
          'notices_type'
          , 'content'
          , 'notices_shopping_app_id'
          , 'DATE_FORMAT(reg_dt, "%Y.%m.%d") AS reg_dt'
        ])
        .from('notices_shopping_app', 'nsa')
        .where('nsa.del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('nsa.view_yn = :view_yn', { view_yn: 'Y' })
        .andWhere('nsa.start_dt <= DATE_FORMAT(NOW(), "%Y%m%d%H%i%s")')
        .andWhere('nsa.end_dt >= DATE_FORMAT(NOW(), "%Y%m%d%H%i%s")');

      if(notices_type) {
        queryBuilder.andWhere('nsa.notices_type = :notices_type', { notices_type });
      }

      const noticesShoppingAppList = await queryBuilder
        .orderBy('nsa.notices_shopping_app_id', 'DESC')
        .getRawMany();

      if (!noticesShoppingAppList || noticesShoppingAppList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: noticesShoppingAppList,
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