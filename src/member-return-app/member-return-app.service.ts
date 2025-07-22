import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { MemberReturnApp } from '../entities/member-return-app.entity';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';

@Injectable()
export class MemberReturnAppService {
  constructor(
    @InjectRepository(MemberReturnApp)
    private memberReturnAppRepository: Repository<MemberReturnApp>,
    private dataSource: DataSource,
  ) {}

  async getMemberReturnAppList(mem_id: string): Promise<{ success: boolean; data: any | null; code: string }> {
    try {
      const result = await this.dataSource
        .createQueryBuilder()
        .select([
          'mara.return_app_id AS return_app_id'
          , 'mara.order_app_id AS order_app_id'
          , 'mara.return_type AS return_type'
          , 'mara.return_status AS return_status'
          , 'mara.reason AS reason'
          , 'mara.admin_reason AS admin_reason'
          , 'mara.cancel_yn AS cancel_yn'
          , 'mara.admin_yn AS admin_yn'
          , 'mara.customer_tracking_number AS customer_tracking_number'
          , 'mara.company_tracking_number AS company_tracking_number'
          , 'mara.customer_courier_code AS customer_courier_code'
          , 'mara.company_courier_code AS company_courier_code'
          , 'DATE_FORMAT(mara.reg_dt, "%y.%m.%d") AS reg_dt'
          , 'pa.product_app_id AS product_app_id'
          , 'pa.brand_name AS brand_name'
          , 'pa.product_name AS product_name'
          , 'pa.price AS price'
          , 'pa.original_price AS original_price'
          , 'pda.option_gender AS option_gender'
          , 'pda.option_unit AS option_unit'
          , 'pda.option_amount AS option_amount'
          , 'moa.order_quantity AS order_quantity'
          , 'mpa.payment_amount AS payment_amount'
        ])
        .from('member_return_app', 'mara')
        .leftJoin('member_order_app', 'moa', 'mara.order_app_id = moa.order_app_id')
        .leftJoin('product_detail_app', 'pda', 'moa.product_detail_app_id = pda.product_detail_app_id')
        .leftJoin('product_app', 'pa', 'pda.product_app_id = pa.product_app_id')
        .leftJoin('member_payment_app', 'mpa', 'moa.payment_app_id = mpa.payment_app_id')
        .where('moa.mem_id = :mem_id', { mem_id })
        .andWhere('mara.cancel_yn = :cancel_yn', { cancel_yn: 'N' })
        .getRawMany();

      if (!result) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: result,
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

  async insertMemberReturnApp(returnData: {
    order_app_id: number;
    shipping_address_id: number;
    mem_id: string;
    return_type: string;
    reason: string;
    file_ids?: number[];
  }): Promise<{ success: boolean; data: any | null; code: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const formattedDate = getCurrentDateYYYYMMDDHHIISS();

      // Insert into member_return_app using query builder
      const returnInsertResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('member_return_app')
        .values({
          order_app_id: returnData.order_app_id,
          shipping_address_id: returnData.shipping_address_id,
          mem_id: returnData.mem_id,
          return_type: returnData.return_type,
          return_status: 'RETURN_APPLY',
          reason: returnData.reason,
          admin_reason: null,
          customer_tracking_number: null,
          company_tracking_number: null,
          customer_courier_code: null,
          company_courier_code: null,
          admin_yn: null,
          cancel_yn: 'N',
          reg_dt: formattedDate,
          reg_id: returnData.mem_id,
          mod_dt: null,
          mod_id: null
        })
        .execute();

      const returnAppId = returnInsertResult.raw.insertId || returnInsertResult.identifiers[0]?.return_app_id;

      // Insert into member_return_app_img if file_id array is provided
      if (returnData.file_ids && returnData.file_ids.length > 0) {
        for (let i = 0; i < returnData.file_ids.length; i++) {
          const fileId = returnData.file_ids[i];
          const orderSeq = i + 1;

          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('member_return_app_img')
            .values({
              return_app_id: returnAppId,
              file_id: fileId,
              order_seq: orderSeq,
              del_yn: 'N',
              reg_dt: formattedDate,
              reg_id: returnData.mem_id,
              mod_dt: null,
              mod_id: null
            })
            .execute();
        }
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        data: { return_app_id: returnAppId },
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error inserting member return app:', error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          success: false,
          message: error.message,
          code: COMMON_RESPONSE_CODES.FAIL
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteMemberReturnApp(returnData: {
    mem_id: string;
    return_app_id: number;
  }): Promise<{ success: boolean; data: any | null; code: string }> {
    try {
      const result = await this.dataSource
        .createQueryBuilder()
        .update('member_return_app')
        .set({
          cancel_yn: 'Y',
          mod_dt: getCurrentDateYYYYMMDDHHIISS(),
          mod_id: returnData.mem_id
        })
        .where('return_app_id = :return_app_id', { return_app_id: returnData.return_app_id })
        .execute();

      return {
        success: true,
        data: result,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error updating member return app:', error);
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