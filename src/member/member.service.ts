import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { GetMemberInfoDto, MemberInfoResponse, UpdateMemberAppPasswordDto, FindPasswordDto } from './dto/member.dto';
import { COMMON_RESPONSE_CODES, WITHDRAWAL_RESPONSE_CODES } from '../core/constants/response-codes';
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
          'mem_id'
          , 'mem_name'
          , 'mem_nickname'
          , 'mem_phone'
          , 'mem_birth'
          , 'mem_gender'
          , 'mem_checkin_number'
          , 'mem_manager'
          , 'mem_sch_id'
          , 'mem_email_id'
          , 'mem_role'
          , 'mem_app_password'
          , 'mem_app_status'
          , 'center_id'
          , 'push_yn'
          , 'push_token'
          , `
              (
                SELECT
                  center_name
                FROM  centers
                WHERE center_id = m.center_id
            ) AS center_name`
          , `
              (
                SELECT
                  ss.sch_time
                FROM  schedule ss
                WHERE ss.sch_id = m.mem_sch_id
              ) AS sch_time
            `
          , `
              (
                SELECT
                  FORMAT(SUM(point_add) - SUM(point_minus), 0)
                FROM      member_point_app smpa
                LEFT JOIN member_order_app moa ON smpa.order_app_id = moa.order_app_id
                WHERE     smpa.mem_id = m.mem_id
                AND       smpa.del_yn = 'N'
                AND       (moa.order_status = 'PURCHASE_CONFIRM' 
                          OR moa.order_status = 'BUY')
              ) AS total_point
            `
          , `
              (
                SELECT
                  COUNT(*)
                FROM      member_coupon_app smca
                LEFT JOIN coupon_app sca ON smca.coupon_app_id = sca.coupon_app_id
                WHERE     sca.del_yn = 'N'
                AND       smca.use_yn = 'N'
                AND       smca.mem_id = m.mem_id
                AND       DATE_FORMAT(NOW(), '%Y%m%d%H%i%s') <= sca.end_dt
              ) AS coupon_cnt
            `
          , `
              (
                SELECT
                  COUNT(*)
                FROM      member_cart_app smca
                WHERE     smca.mem_id = m.mem_id
                AND       smca.del_yn = 'N'
              ) AS cart_cnt
            `
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
      const isPasswordValid = await bcrypt.compare(current_password, member.mem_app_password);
      
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

  async findId(mem_name: string, mem_phone: string): Promise<{ success: boolean; message: string; code: string; data: any}> {

    try {
      const existingMember = await this.memberRepository
        .createQueryBuilder()
        .select(['mem_email_id', 'DATE_FORMAT(app_reg_dt, "%Y.%m.%d") AS app_reg_dt'])
        .where('mem_name = :mem_name', { mem_name })
        .andWhere('mem_phone = :mem_phone', { mem_phone })
        .getRawOne();

      if (!existingMember) {
        return {
          success: false,
          message: '일치하는 회원 정보를 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA,
          data: null
        };
      }

      return {
        success: true,
        message: '일치하는 회원 정보를 찾았습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS,
        data: existingMember
      };
    } catch (error) {
      console.error('Error finding id:', error);
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
      const {  mem_email_id, mem_name, mem_phone } = findPasswordDto;
      
      const member = await this.memberRepository
        .createQueryBuilder()
        .select('mem_id')
        .where('mem_name = :mem_name', { mem_name })
        .andWhere('mem_phone = :mem_phone', { mem_phone })
        .andWhere('mem_email_id = :mem_email_id', { mem_email_id })
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

  async updateMemberWithdrawal(mem_id: number): Promise<{ success: boolean; message: string; code: string }> {
    try {

      const member = await this.memberRepository
        .createQueryBuilder()
        .select('COUNT(*)')
        .from('member_order_app', 'moa')
        .where('moa.mem_id = :mem_id', { mem_id })
        .andWhere('moa.order_status NOT IN (:...statuses)', { 
          statuses: ['PURCHASE_CONFIRM', 'RETURN_COMPLETE', 'EXCHANGE_COMPLETE'] 
        })
        .getRawOne();

      if (member.count > 0) {
        return {
          success: false,
          message: '처리 중인 주문이 있어 탈퇴할 수 없습니다.',
          code: WITHDRAWAL_RESPONSE_CODES.ORDER_PROCESSING
        };
      }

      const reservation = await this.memberRepository
        .createQueryBuilder()
        .select('COUNT(*)')
        .from('member_schedule_app', 'msa')
        .where('msa.mem_id = :mem_id', { mem_id })
        .andWhere('msa.sch_dt = "RESERVATION_CONFIRM"')
        .getRawOne();

      if (reservation.count > 0) {
        return {
          success: false,
          message: '처리 중인 예약이 있어 탈퇴할 수 없습니다.',
          code: WITHDRAWAL_RESPONSE_CODES.RESERVATION_PROCESSING
        };
      }

      const result = await this.memberRepository
        .createQueryBuilder()
        .update('members')
        .set({
          mem_app_status: 'EXIT',
          app_exit_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
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
        message: '회원 탈퇴가 완료되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error updating member status:', error);
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

  async updatePushToken(mem_id: number, push_token: string): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const result = await this.memberRepository
        .createQueryBuilder()
        .update('members')
        .set({
          push_token: push_token,
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
        message: 'Push token이 성공적으로 업데이트되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error updating push token:', error);
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

  async updatePushYn(mem_id: number, push_yn: string): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const result = await this.memberRepository
        .createQueryBuilder()
        .update('members')
        .set({
          push_yn,
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
        message: 'Push 수신 여부가 성공적으로 업데이트되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error updating push yn:', error);
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

  async updateRecentDt(mem_id: number): Promise<{ success: boolean; message: string; code: string }> {
    try {

      const result = await this.memberRepository
        .createQueryBuilder()
        .update('members')
        .set({
          recent_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
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
        message: '최근 접속일이 성공적으로 업데이트되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error updating recent date:', error);
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