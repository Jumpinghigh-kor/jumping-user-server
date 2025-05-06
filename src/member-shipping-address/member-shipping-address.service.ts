import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';
import { GetMemberShippingAddressListDto } from './dto/member-shipping-address.dto';

@Injectable()
export class MemberShippingAddressService {
  constructor(
    private dataSource: DataSource
  ) {}

  async getMemberShippingAddressList(getMemberShippingAddressListDto: GetMemberShippingAddressListDto): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const { mem_id } = getMemberShippingAddressListDto;
      
      const addressList = await this.dataSource.manager
        .createQueryBuilder()
        .select([
          'shipping_address_id'
          , 'mem_id'
          , 'shipping_address_name'
          , 'receiver_name'
          , 'receiver_phone'
          , 'default_yn'
          , 'del_yn'
          , 'address'
          , 'address_detail'
          , 'zip_code'
          , 'enter_way'
          , 'enter_memo'
          , 'delivery_request'
          , 'reg_dt'
          , 'reg_id'
          , 'mod_dt'
          , 'mod_id'
        ])
        .from('member_shipping_address', 'msa')
        .where('msa.mem_id = :mem_id', { mem_id })
        .andWhere('msa.del_yn = :del_yn', { del_yn: 'N' })
        .getRawMany();

      if (!addressList || addressList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: addressList,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error fetching shipping address list:', error);
      return {
        success: false,
        data: null,
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }
} 