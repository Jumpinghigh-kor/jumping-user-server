import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class MemberOrderAppService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async getMemberOrderAppList(mem_id: string, screen_type: string): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const subQuery = this.memberRepository.manager
        .createQueryBuilder()
        .select([
          'pa.product_app_id AS product_app_id'
          , 'pa.brand_name AS brand_name'
          , 'pa.product_name AS product_name'
          , 'pa.title AS product_title'
          , 'moa.order_quantity AS order_quantity'
          , `FORMAT(moa.order_price, 0) AS order_price`
          , 'CONCAT(SUBSTRING(DATE_FORMAT(STR_TO_DATE(moa.order_dt, "%Y%m%d%H%i%s"), "%Y.%m.%d"), 3, 2), ".", DATE_FORMAT(STR_TO_DATE(moa.order_dt, "%Y%m%d%H%i%s"), "%m.%d")) AS order_dt'
          , 'pda.option_amount AS option_amount'
          , 'pda.option_type AS option_type'
          , `(
              SELECT
                CASE
                  WHEN COUNT(*) > 0 THEN 'Y'
                  ELSE 'N'
                END
              FROM  member_review_app smra
              WHERE smra.mem_id = moa.mem_id
              AND   smra.product_app_id = pa.product_app_id
              AND   smra.del_yn = 'N'
          ) AS review_yn`
          , 'moa.order_status AS order_status'
        ])
        .from('member_order_app', 'moa')
        .leftJoin('product_detail_app', 'pda', 'moa.product_detail_app_id = pda.product_detail_app_id')
        .leftJoin('product_app', 'pa', 'pda.product_app_id = pa.product_app_id')
        .where('moa.mem_id = :mem_id', { mem_id })
        .andWhere('refund_yn = :refund', { refund: 'N' });

      if(screen_type == 'REVIEW') {
        subQuery.andWhere('order_status = :status', { status: 'COMPLETE' });
      }

      // Create a wrapper query that selects from the subquery
      const queryBuilder = this.memberRepository.manager
        .createQueryBuilder()
        .select('*')
        .from(`(${subQuery.getQuery()})`, 'A')
        .setParameters(subQuery.getParameters());
        
      if(screen_type == 'REVIEW') {
        queryBuilder.andWhere('review_yn = :review_yn', { review_yn: 'N' });
      }

      const orders = await queryBuilder.getRawMany();

      if (!orders || orders.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: orders,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }
} 