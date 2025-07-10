import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { GetReturnExchangePolicyDto } from './dto/return_exchange_policy.dto';

@Injectable()
export class ReturnExchangePolicyService {
  constructor(
    private dataSource: DataSource
  ) {}

  async getReturnExchangePolicyList(getReturnExchangePolicyDto: GetReturnExchangePolicyDto): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const { product_app_id } = getReturnExchangePolicyDto;
      
      const returnExchangePolicyList = await this.dataSource.manager
        .createQueryBuilder()
        .select([
          're.return_exchange_id AS return_exchange_id'
          , 're.title AS title'
          , 're.content AS content'
          , 're.direction AS direction'
          , 're.order_seq AS order_seq'
        ])
        .from('return_exchange_policy', 're')
        .where('re.use_yn = :use_yn', { use_yn: 'Y' })
        .andWhere('re.del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('re.product_app_id = :product_app_id', { product_app_id })
        .orderBy('re.order_seq', 'ASC')
        .orderBy('re.direction', 'ASC')
        .getRawMany();

      if (!returnExchangePolicyList || returnExchangePolicyList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: returnExchangePolicyList,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error fetching zzim list:', error);
      return {
        success: false,
        data: null,
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }
} 