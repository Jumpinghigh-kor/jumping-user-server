import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { MemberReturnApp } from '../entities/member-return-app.entity';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';
import { InsertMemberReturnAppDto } from './dto/member-return-app.dto';

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
          , 'mara.order_detail_app_id AS order_detail_app_id'
          , 'mara.return_applicator AS return_applicator'
          , 'mara.return_reason_type AS return_reason_type'
          , 'mara.reason AS reason'
          , 'mara.cancel_yn AS cancel_yn'
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
          , 'moda.order_quantity AS order_quantity'
          , 'mpa.payment_amount AS payment_amount'
        ])
        .from('member_return_app', 'mara')
        .innerJoin('member_order_detail_app', 'moda', 'mara.order_detail_app_id = moda.order_detail_app_id')
        .leftJoin('member_order_app', 'moa', 'moda.order_app_id = moa.order_app_id')
        .leftJoin('product_detail_app', 'pda', 'moda.product_detail_app_id = pda.product_detail_app_id')
        .leftJoin('product_app', 'pa', 'pda.product_app_id = pa.product_app_id')
        .leftJoin('member_payment_app', 'mpa', 'moa.order_app_id = mpa.order_app_id')
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

  async insertMemberReturnApp(returnData: any): Promise<{ success: boolean; data: any | null; code: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const formattedDate = getCurrentDateYYYYMMDDHHIISS();
      const items = Array.isArray(returnData) ? returnData : [returnData];
      const createdReturnAppIds: number[] = [];

      for (const item of items) {
        const returnInsertResult = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into('member_return_app')
          .values({
            order_detail_app_id: item.order_detail_app_id,
            order_address_id: item.order_address_id,
            mem_id: item.mem_id,
            return_applicator: item.return_applicator,
            return_reason_type: item.return_reason_type,
            reason: item.reason,
            customer_tracking_number: null,
            company_tracking_number: null,
            customer_courier_code: null,
            company_courier_code: null,
            quantity: item.quantity,
            return_goodsflow_id: item.return_goodsflow_id,
            approval_yn: null,
            cancel_yn: 'N',
            reg_dt: formattedDate,
            reg_id: item.mem_id,
            mod_dt: null,
            mod_id: null
          })
          .execute();

        const returnAppId = returnInsertResult.raw.insertId || returnInsertResult.identifiers[0]?.return_app_id;
        createdReturnAppIds.push(returnAppId);

        if (item.file_ids && item.file_ids.length > 0) {
          for (let i = 0; i < item.file_ids.length; i++) {
            const fileId = item.file_ids[i];
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
                reg_id: item.mem_id,
                mod_dt: null,
                mod_id: null
              })
              .execute();
          }
        }
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        data: Array.isArray(returnData)
          ? { return_app_ids: createdReturnAppIds }
          : { return_app_id: createdReturnAppIds[0] },
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

  async updateMemberReturnApp(returnData: {
    mem_id: string;
    order_detail_app_ids: number[];
    return_reason_type: string;
    reason: string;
    cancel_yn: string;
  }): Promise<{ success: boolean; data: any | null; code: string }> {
    try {
      const result = await this.dataSource
        .createQueryBuilder()
        .update('member_return_app')
        .set({
          return_reason_type: returnData.return_reason_type,
          reason: returnData.reason,
          cancel_yn: returnData.cancel_yn,
          mod_dt: getCurrentDateYYYYMMDDHHIISS(),
          mod_id: returnData.mem_id
        })
        .where('order_detail_app_id IN (:...order_detail_app_ids)', { order_detail_app_ids: returnData.order_detail_app_ids })
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

  async cancelMemberReturnApp(returnData: {
    mem_id: string;
    order_detail_app_ids: number[];
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
        .where('order_detail_app_id IN (:...order_detail_app_ids)', { order_detail_app_ids: returnData.order_detail_app_ids })
        .execute();

      return {
        success: true,
        data: result,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error restoring member return app:', error);
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