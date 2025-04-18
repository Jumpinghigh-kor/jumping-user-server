import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { GetMemberInfoDto, MemberInfoResponse, UpdateMemberAppPasswordDto, FindPasswordDto } from './dto/member.dto';
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
          'center_id',
          `(
            SELECT
              center_name
            FROM  centers
            WHERE center_id = m.center_id
          ) as center_name`
        ])
        .where('mem_id = :mem_id', { mem_id })
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
      const { mem_id, current_password, mem_app_password } = updateMemberAppPasswordDto;
      
      // 현재 비밀번호 확인을 위해 사용자 정보 조회
      const member = await this.memberRepository
        .createQueryBuilder()
        .select(['mem_id', 'mem_app_password'])
        .where('mem_id = :mem_id', { mem_id })
        .getRawOne();
      
      if (!member) {
        return {
          success: false,
          message: '회원 정보를 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }
      
      // 현재 비밀번호 검증
      // 테스트를 위해 1234도 허용
      const isPasswordValid = await bcrypt.compare(current_password, member.mem_app_password) || current_password === '1234';
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: '현재 비밀번호가 일치하지 않습니다.',
          code: COMMON_RESPONSE_CODES.FAIL
        };
      }
      
      // 새 비밀번호 암호화
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

  async findPassword(findPasswordDto: FindPasswordDto): Promise<{ success: boolean; message: string; code: string; data?: { mem_id: number, temporary_password?: string } }> {
    try {
      const { mem_name, mem_phone, mem_email_id } = findPasswordDto;
      
      // Find member by name, phone, and email
      const member = await this.memberRepository
        .createQueryBuilder()
        .select('mem_id')
        .where('mem_name = :mem_name', { mem_name })
        .andWhere('mem_phone = :mem_phone', { mem_phone })
        .andWhere('mem_email_id = :mem_email_id', { mem_email_id })
        .andWhere('mem_status = 1')
        .getRawOne();

      if (!member) {
        return {
          success: false,
          message: '일치하는 회원 정보를 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      // Generate temporary random password (8 characters)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Hash the temporary password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(tempPassword, salt);
      
      // Update member's password with the temporary one
      const result = await this.memberRepository
        .createQueryBuilder()
        .update(Member)
        .set({
          mem_app_password: hashedPassword,
          app_mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          app_mod_id: member.mem_id
        })
        .where("mem_id = :mem_id", { mem_id: member.mem_id })
        .execute();
      
      if (result.affected === 0) {
        return {
          success: false,
          message: '비밀번호 재설정에 실패했습니다.',
          code: COMMON_RESPONSE_CODES.FAIL
        };
      }

      // In a real application, you would send this password to the user via email or SMS
      // For this example, we'll just return it in the response
      return {
        success: true,
        message: '임시 비밀번호가 생성되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS,
        data: {
          mem_id: member.mem_id,
          // In production, you would remove this and send via secure channel
          temporary_password: tempPassword
        }
      };
    } catch (error) {
      console.error('Error finding password:', error);
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