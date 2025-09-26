import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Member } from '../entities/member.entity';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';
import { InsertMemberOrderAppDto } from './dto/member-order-app.dto';
import { UpdateOrderStatusDto } from './dto/member-order-app.dto';

@Injectable()
export class MemberOrderAppService {
  constructor(
    private dataSource: DataSource
  ) {}

  async getMemberOrderAppList(mem_id: string, screen_type: string, year: string, search_title: string): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const subQuery = this.dataSource.manager
        .createQueryBuilder()
        .select([
          'pa.product_app_id AS product_app_id'
          , 'pa.brand_name AS brand_name'
          , 'pa.product_name AS product_name'
          , 'pa.title AS product_title'
          , 'pa.courier_code AS courier_code'
          , 'pa.discount AS discount'
          , 'FORMAT(pa.delivery_fee, 0) AS delivery_fee'
          , 'FORMAT(pa.free_shipping_amount, 0) AS free_shipping_amount'
          , 'pa.inquiry_phone_number AS inquiry_phone_number'
          , 'pa.today_send_yn AS today_send_yn'
          , 'CONCAT(SUBSTRING(pa.today_send_time, 1, 2), ":", SUBSTRING(pa.today_send_time, 3, 2)) AS today_send_time'
          , 'pa.not_today_send_day AS not_today_send_day'
          , 'FORMAT(pa.original_price, 0) AS original_price'
          , 'FORMAT(pa.price, 0) AS price'
          , `
              (
                SELECT
                  FORMAT(SUM(smpa.payment_amount) - IFNULL(SUM(smpa.refund_amount), 0), 0)
                FROM  member_payment_app smpa
                WHERE smpa.order_app_id = moa.order_app_id
                ORDER BY smpa.payment_app_id DESC
                LIMIT 1
              ) AS order_price
            `
          , 'pda.product_detail_app_id AS product_detail_app_id'
          , 'pda.option_amount AS option_amount'
          , 'pda.option_type AS option_type'
          , 'pda.option_unit AS option_unit'
          , `
              (
                SELECT
                  CASE
                    WHEN COUNT(*) > 0 THEN 'Y'
                    ELSE 'N'
                  END
                FROM  member_review_app smra
                WHERE smra.mem_id = moa.mem_id
                AND   smra.product_app_id = pda.product_app_id
                AND   smra.del_yn = 'N'
            ) AS review_yn`
            , 'moa.order_app_id AS order_app_id'
            , 'moda.order_detail_app_id AS order_detail_app_id'
            , 'moda.order_status AS order_status'
            , 'moda.order_quantity AS order_quantity'
            , 'DATE_FORMAT(moa.order_dt, "%y.%m.%d") AS order_dt'
            , 'moda.tracking_number AS tracking_number'
            , `
                (
                  SELECT
                    smoa.receiver_name
                  FROM  member_order_address smoa
                  WHERE smoa.order_detail_app_id = moda.order_detail_app_id
                ) AS receiver_name
              `
            , `
                (
                  SELECT
                    smra.return_app_id AS return_app_id
                  FROM  member_return_app smra
                  WHERE smra.order_detail_app_id = moda.order_detail_app_id
                ) AS return_app_id
              `
            , `
                (
                  SELECT
                    smra.approval_yn AS approval_yn
                  FROM  member_return_app smra
                  WHERE smra.order_detail_app_id = moda.order_detail_app_id
                ) AS approval_yn
              `
            , `
            		(
                  SELECT
                    smpa.payment_app_id
                  FROM	member_payment_app smpa
                  WHERE	smpa.order_app_id = moa.order_app_id
                  AND		smpa.payment_type = 'PRODUCT_BUY'
                )	AS 	payment_app_id
              `
        ])
        .from('members', 'm')
        .innerJoin('member_order_app', 'moa', 'm.mem_id = moa.mem_id')
        .leftJoin('member_order_detail_app', 'moda', 'moa.order_app_id = moda.order_app_id')
        .leftJoin('product_detail_app', 'pda', 'moda.product_detail_app_id = pda.product_detail_app_id')
        .leftJoin('product_app', 'pa', 'pda.product_app_id = pa.product_app_id')
        .leftJoin('member_return_app', 'mpa', 'moda.order_detail_app_id = mpa.order_detail_app_id')
        .where('moa.mem_id = :mem_id', { mem_id })
        .andWhere('moa.del_yn = :del_yn', { del_yn: 'N' })
        .orderBy('moa.order_dt', 'DESC');

      if(screen_type == 'REVIEW') {
        subQuery.andWhere('order_status = :status', { status: 'PURCHASE_CONFIRM' });
      }
      
      if(year) {
        subQuery.andWhere('DATE_FORMAT(moa.order_dt, "%Y") = :year', { year });
      }
      
      if(search_title) {
        subQuery.andWhere('pa.product_name LIKE CONCAT("%", :search_title, "%")', { search_title });
      }
      
      // Create a wrapper query that selects from the subquery
      const queryBuilder = this.dataSource.manager
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
      console.error('Query Error:', error);
      return {
        success: false,
        data: null,
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }

  async insertMemberOrderApp(insertMemberOrderAppDto: InsertMemberOrderAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id } = insertMemberOrderAppDto;
      
      const reg_dt = getCurrentDateYYYYMMDDHHIISS();
      
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('member_order_app')
        .values({
          mem_id: mem_id,
          order_dt: reg_dt,
          order_memo: null,
          order_memo_dt: null,
          memo_check_yn: null,
          memo_del_yn: null,
          del_yn: 'N',
          reg_dt: reg_dt,
          reg_id: mem_id,
          mod_dt: null,
          mod_id: null
        })
        .execute();
      
      return {
        success: true,
        message: '주문 정보가 성공적으로 등록되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error creating order:', error);
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

  async updateOrderStatus(updateData: UpdateOrderStatusDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, order_detail_app_ids, order_group, order_status } = updateData;
      
      const setPayload: any = {
        order_status: order_status,
        mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
        mod_id: mem_id
      };

      if (order_group !== undefined && order_group !== null) {
        setPayload.order_group = order_group;
      }

      const result = await this.dataSource
        .createQueryBuilder()
        .update('member_order_detail_app')
        .set(setPayload)
        .where("order_detail_app_id IN (:...order_detail_app_ids)", { order_detail_app_ids: order_detail_app_ids })
        .execute();

      if (result.affected === 0) {
        return {
          success: false,
          message: '업데이트할 주문 정보를 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        message: '장바구니가 수정되었습니다',
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