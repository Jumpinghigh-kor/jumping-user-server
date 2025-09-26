import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberOrderAddress } from '../entities/member-order-address.entity';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';
import { InsertMemberOrderAddressDto } from './dto/member-order-address.dto';

@Injectable()
export class MemberOrderAddressService {
  constructor(
    @InjectRepository(MemberOrderAddress)
    private memberOrderAddressRepository: Repository<MemberOrderAddress>,
    private dataSource: DataSource
  ) {}

  async insertMemberOrderAddress(insertMemberOrderAddressDto: InsertMemberOrderAddressDto, mem_id: number): Promise<{ success: boolean; data: { order_address_id: number } | null; code: string }> {
    try {
      const { order_detail_app_id, mem_id, receiver_name, receiver_phone, address, address_detail, zip_code, enter_way, enter_memo, delivery_request } = insertMemberOrderAddressDto;
      
      const reg_dt = getCurrentDateYYYYMMDDHHIISS();
      
      const result = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('member_order_address')
        .values({
          order_detail_app_id: order_detail_app_id,
          mem_id: mem_id,
          order_address_type: 'ORDER',
          receiver_name: receiver_name,
          receiver_phone: receiver_phone,
          address: address,
          address_detail: address_detail,
          zip_code: zip_code,
          enter_way: enter_way,
          enter_memo: enter_memo,
          delivery_request: delivery_request,
          use_yn: 'Y',
          reg_dt: reg_dt,
          reg_id: mem_id,
          mod_dt: null,
          mod_id: null
        })
        .execute();
      
      const order_address_id = result.identifiers[0].order_address_id;
      
      return {
        success: true,
        data: { order_address_id },
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error creating order address:', error);
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