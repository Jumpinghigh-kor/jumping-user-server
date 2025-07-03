import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class InquiryShoppingAppService {
  constructor(
    private dataSource: DataSource,
  ) {}

  async insertInquiryShoppingApp(mem_id: number, product_app_id: number, description: string): Promise<{ success: boolean; code: string }> {
    try {
      const currentDateTime = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14);
      
      const result = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('inquiry_shopping_app')
        .values({
          mem_id: mem_id,
          product_app_id: product_app_id,
          description: description,
          del_yn: 'N',
          reg_dt: currentDateTime,
          reg_id: mem_id
        })
        .execute();

      return {
        success: true,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Insert Error:', error);
      return {
        success: false,
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }
} 