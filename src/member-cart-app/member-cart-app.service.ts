import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberCartApp } from './dto/member-cart-app.dto';
import { GetMemberCartAppListDto, MemberCartAppListResponse, UpdateMemberCartAppDto } from './dto/member-cart-app.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class MemberCartAppService {
  constructor(
    @InjectRepository(MemberCartApp)
    private memberCartAppRepository: Repository<MemberCartApp>,
    private dataSource: DataSource
  ) {}

  async getMemberCartAppList(getMemberCartAppListDto: GetMemberCartAppListDto): Promise<{ success: boolean; data: MemberCartAppListResponse[] | null; code: string }> {
    try {
      const { mem_id } = getMemberCartAppListDto;
      
      // Using QueryBuilder for the cart list query
      const cartList = await this.dataSource
        .createQueryBuilder()
        .select([
          'mca.cart_app_id AS cart_app_id'
          , 'mca.mem_id AS mem_id'
          , 'mca.product_detail_app_id AS product_detail_app_id'
          , 'mca.quantity AS quantity'
          , 'pa.product_app_id AS product_app_id'
          , 'pa.title AS title'
          , 'pa.product_name AS product_name'
          , 'pa.brand_name AS brand_name'
          , 'pa.original_price AS original_price'
          , 'pa.price AS price'
          , 'pa.discount AS discount'
          , 'pda.quantity AS product_quantity'
          , 'pda.option_type AS option_type'
          , 'pda.option_amount AS option_amount'
          , 'pda.option_unit AS option_unit'
          , 'pda.option_gender AS option_gender'
        ])
        .from('member_cart_app', 'mca')
        .leftJoin('product_detail_app', 'pda', 'mca.product_detail_app_id = pda.product_detail_app_id')
        .leftJoin('product_app', 'pa', 'pda.product_app_id = pa.product_app_id')
        .where('mca.mem_id = :mem_id', { mem_id })
        .andWhere('mca.del_yn = :del_yn', { del_yn: 'N' })
        .getRawMany();

      if (!cartList || cartList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: cartList,
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

  async insertMemberCartApp(cartData: any): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const dataToInsert = Array.isArray(cartData) ? cartData : [cartData];

      for (const item of dataToInsert) {
        const { mem_id, product_detail_app_id, quantity } = item;
        
        const result = await this.dataSource.query(
          `SELECT
            COUNT(*) as count
          FROM  member_cart_app
          WHERE mem_id = ?
          AND   product_detail_app_id = ?
          AND   del_yn = 'N'`,
          [mem_id, product_detail_app_id]
        );
        
        if (result[0].count > 0) {
          await this.dataSource.query(
            `UPDATE member_cart_app SET
              quantity = ?
              , mod_dt = DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')
              , mod_id = ?
            WHERE mem_id = ?
            AND   product_detail_app_id = ?
            AND   del_yn = 'N'
            `,
            [quantity, mem_id, mem_id, product_detail_app_id]
          );
        } else {
          await this.dataSource.query(
            `INSERT INTO member_cart_app (
              mem_id
              , product_detail_app_id
              , quantity
              , del_yn
              , reg_dt
              , reg_id
              , mod_dt
              , mod_id
            ) VALUES (
              ?
              , ?
              , ?
              , 'N'
              , DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')
              , ?
              , null
              , null
            )`,
            [mem_id, product_detail_app_id, quantity, mem_id]
          );
        }
      }

      return {
        success: true,
        message: '장바구니에 추가되었습니다.',
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

  async deleteMemberCartApp(data: any): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const dataToDelete = Array.isArray(data) ? data : [data];
      
      for (const item of dataToDelete) {
        const { mem_id, cart_app_id } = item;
        
        await this.dataSource.query(
          `UPDATE member_cart_app SET
            del_yn = 'Y'
            , mod_dt = DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')
            , mod_id = ?
          WHERE mem_id = ?
          AND   cart_app_id = ?`,
          [mem_id, mem_id, cart_app_id]
        );
      }

      return {
        success: true,
        message: '선택한 상품이 장바구니에서 삭제됐습니다',
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

  async updateMemberCartApp(updateData: UpdateMemberCartAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, cart_app_id, product_detail_app_id, quantity } = updateData;
      
      // Using QueryBuilder for update operation
      const result = await this.dataSource
        .createQueryBuilder()
        .update('member_cart_app')
        .set({
          quantity: quantity,
          product_detail_app_id: product_detail_app_id,
          mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          mod_id: mem_id
        })
        .where("mem_id = :mem_id", { mem_id })
        .andWhere("cart_app_id = :cart_app_id", { cart_app_id })
        .execute();

      if (result.affected === 0) {
        return {
          success: false,
          message: '업데이트할 장바구니 정보를 찾을 수 없습니다.',
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