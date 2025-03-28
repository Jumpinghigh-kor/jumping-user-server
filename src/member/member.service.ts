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

  async checkNicknameDuplicate(mem_nickname: string): Promise<{ success: boolean; message: string; code: string }> {
    try {
      console.log('Checking nickname:', mem_nickname);
      
      // 테이블과 별칭을 일관되게 사용
      const existingMember = await this.memberRepository
        .createQueryBuilder()
        .select('mem_id')
        .where('mem_nickname = :mem_nickname', { mem_nickname })
        .andWhere('mem_app_status = :status', { status: 'ACTIVE' })
        .getRawOne();

      console.log('Query result:', existingMember);

      if (existingMember) {
        return {
          success: false,
          message: '이미 사용 중인 닉네임입니다.',
          code: COMMON_RESPONSE_CODES.DUPLICATE
        };
      }

      return {
        success: true,
        message: '사용 가능한 닉네임입니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error checking nickname:', error);
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

  async completeSignup(data: { mem_id: number, mem_nickname: string }): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, mem_nickname } = data;
      
      // 현재 시간 포맷팅 (YYYYMMDDHHIISS)
      const app_mod_dt = () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')";
      console.log('mem_id::', mem_id)
      // Update member record
      const result = await this.memberRepository
        .createQueryBuilder()
        .update('members')
        .set({
          mem_nickname,
          mem_app_status: 'ACTIVE',
          app_mod_dt,
          app_mod_id: mem_id
        })
        .where("mem_id = :mem_id", { mem_id })
        .execute();
      console.log('result::', result)
      if (result.affected === 0) {
        return {
          success: false,
          message: '업데이트할 회원을 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        message: '회원 가입이 완료되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error completing signup:', error);
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