import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class MemberPointAppService {
  constructor(
    private dataSource: DataSource,
  ) {}

  async getMemberPointAppList(mem_id: string, reg_ym: string): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const memberPointAppList = await this.dataSource
        .createQueryBuilder()
        .select([
          'mpa.point_add'
          , 'mpa.point_minus'
          , 'DATE_FORMAT(mpa.reg_dt, "%m.%d") AS reg_dt'
          , 'pa.product_name'
          , 'pa.brand_name'
          , 'pda.option_unit'
          , 'pda.option_amount'
          , 'pda.option_gender'
          , 'moa.order_quantity'
        ])
        .from('members', 'm')
        .innerJoin('member_point_app', 'mpa', 'm.mem_id = mpa.mem_id')
        .innerJoin('member_order_app', 'moa', 'mpa.order_app_id = moa.order_app_id')
        .leftJoin('product_detail_app', 'pda', 'moa.product_detail_app_id = pda.product_detail_app_id')
        .leftJoin('product_app', 'pa', 'pda.product_app_id = pa.product_app_id')
        .where('m.mem_id = :memId')
        .andWhere('moa.order_status = "COMPLETE"')
        .andWhere('mpa.del_yn = "N"')
        .andWhere('DATE_FORMAT(mpa.reg_dt, "%Y%m") = :regYm')
        .orderBy('mpa.point_app_id', 'DESC')
        .setParameters({memId: mem_id, regYm: reg_ym})
        .getRawMany();

      if (!memberPointAppList || memberPointAppList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: memberPointAppList,
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