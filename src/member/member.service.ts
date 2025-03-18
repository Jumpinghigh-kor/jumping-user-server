import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { GetMemberInfoDto, MemberInfoResponse } from './dto/member.dto';
import { COMMON_RESPONSE_CODES } from '../common/constants/response-codes';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>
  ) {}

  async getMemberInfo(getMemberInfoDto: GetMemberInfoDto): Promise<{ success: boolean; data: MemberInfoResponse | null; code: string }> {
    try {
      const { mem_id } = getMemberInfoDto;
      
      // Using the provided SQL query
      const memberInfo = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'mem_id',
          'mem_name',
          'mem_phone',
          'mem_birth',
          'mem_gender',
          'mem_checkin_number',
          'mem_manager',
          'mem_sch_id',
          'mem_email_id',
          'mem_app_status',
          'center_id'
        ])
        .where('mem_status = 1')
        .andWhere('mem_id = :mem_id', { mem_id })
        .getRawOne();

      if (!memberInfo) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: memberInfo,
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