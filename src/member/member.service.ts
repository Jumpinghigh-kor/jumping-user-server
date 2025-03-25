import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { GetMemberInfoDto, MemberInfoResponse, UpdateMemberAppPasswordDto } from './dto/member.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import * as bcrypt from 'bcrypt';

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
          'mem_nickname',
          'mem_phone',
          'mem_birth',
          'mem_gender',
          'mem_checkin_number',
          'mem_manager',
          'mem_sch_id',
          'mem_email_id',
          'mem_app_password',
          'mem_app_status',
          'center_id'
        ])
        .where('mem_status = 1')
        .andWhere('mem_app_status = "ACTIVE"')
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

  async updateMemberAppPassword(updateMemberAppPasswordDto: UpdateMemberAppPasswordDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, mem_app_password } = updateMemberAppPasswordDto;
      console.log('mem_id', mem_id);
      // 비밀번호 암호화
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(mem_app_password, salt);
      
      // Using QueryBuilder for the update
      const result = await this.memberRepository
        .createQueryBuilder()
        .update(Member)
        .set({
          mem_app_password: hashedPassword,
          app_mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          app_mod_id: mem_id
        })
        .where("mem_id = :mem_id", { mem_id })
        .execute();
      
      if (result.affected === 0) {
        return {
          success: false,
          message: '업데이트할 회원을 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        message: '비밀번호가 성공적으로 업데이트되었습니다.',
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