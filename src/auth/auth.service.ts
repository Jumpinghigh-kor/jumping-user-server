import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { getCurrentDateYYYYMMDDHHIISS, getFutureDate } from '../core/utils/date.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const member = await this.memberRepository
        .createQueryBuilder('m')
        .select([
          'm.mem_id',
          'm.mem_email_id',
          'm.mem_name',
          'm.mem_app_password',
          'm.center_id',
          'm.mem_app_status'
        ])
        .where('m.mem_email_id = :email', { email })
        .getOne();
        
      if (!member) {
        throw new HttpException({
          success: false,
          message: '존재하지 않는 이메일입니다.',
          code: 'EMAIL_NOT_FOUND',
          field: 'mem_email_id'
        }, HttpStatus.BAD_REQUEST);
      }

      // 임시: 비밀번호가 1234인 경우 허용
      if (password === '1234') {
        const { mem_app_password, ...result } = member;
        return result;
      }

      // 비밀번호가 없는 경우
      if (!member.mem_app_password) {
        throw new HttpException({
          success: false,
          message: '비밀번호가 설정되지 않았습니다. 비밀번호 설정이 필요합니다.',
          code: 'PASSWORD_NOT_SET',
          field: 'mem_app_password'
        }, HttpStatus.BAD_REQUEST);
      }

      try {
        const isMatch = await bcrypt.compare(password, member.mem_app_password);
        if (!isMatch) {
          throw new HttpException({
            success: false,
            message: '아이디 또는 비밀번호가 일치하지 않습니다.',
            code: 'INVALID_PASSWORD',
            field: 'mem_app_password'
          }, HttpStatus.BAD_REQUEST);
        }
      } catch (bcryptError) {
        // bcrypt 비교 중 에러가 발생한 경우 (해시되지 않은 비밀번호일 수 있음)
        if (password !== member.mem_app_password) {
          throw new HttpException({
            success: false,
            message: '비밀번호가 일치하지 않습니다.',
            code: 'INVALID_PASSWORD',
            field: 'mem_app_password'
          }, HttpStatus.BAD_REQUEST);
        }
      }

      const { mem_app_password, ...result } = member;
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        success: false,
        message: '로그인 처리 중 오류가 발생했습니다.',
        code: 'SERVER_ERROR'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(user: any) {
    try {
      const payload = { 
        mem_id: user.mem_id,
        mem_email_id: user.mem_email_id,
        mem_name: user.mem_name,
        center_id: user.center_id,
        mem_app_status: user.mem_app_status
      };
      
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = await this.generateRefreshToken(user.mem_id);

      return {
        success: true,
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          user: payload
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException('로그인 처리 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async generateRefreshToken(mem_id: number): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { mem_id },
      { expiresIn: '1y' }  // 리프레시 토큰 1년
    );

    const reg_dt = getCurrentDateYYYYMMDDHHIISS();
    
    // 만료 시간 계산 - 1년(365일) 설정
    // 5초 = 5초
    // 1시간 = 60 * 60 = 3600초
    // 1일 = 24 * 3600 = 86400초
    // 1년 = 365 * 86400 = 31536000초
    const expirationSeconds = 31536000; // 1년
    const expires_dt = getFutureDate(expirationSeconds);

    // 기존 리프레시 토큰을 del_yn = 'Y'로 업데이트
    await this.refreshTokenRepository.update(
      { mem_id, del_yn: 'N' },
      { 
        del_yn: 'Y',
        mod_dt: reg_dt,
        mod_id: mem_id
      }
    );

    // 새로운 리프레시 토큰 저장
    await this.refreshTokenRepository.save({
      mem_id,
      token: refreshToken,
      expires_dt,
      del_yn: 'N',
      reg_dt,
      reg_id: mem_id
    });

    return refreshToken;
  }

  async refreshAccessToken(refreshToken: string): Promise<{ success: boolean; data: { access_token: string } | null; code: string }> {
    try {
      const tokenData = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken, del_yn: 'N' }
      });

      if (!tokenData) {
        return {
          success: false,
          data: null,
          code: 'INVALID_REFRESH_TOKEN'
        };
      }

      // YYYYMMDDHHIISS 형식의 날짜 비교
      const now = getCurrentDateYYYYMMDDHHIISS();
      const expires = tokenData.expires_dt;
      
      if (now > expires) {
        console.log('리프레시 토큰 만료됨', {
          current: now,
          expires: expires
        });
        return {
          success: false,
          data: null,
          code: 'EXPIRED_REFRESH_TOKEN'
        };
      }

      const member = await this.memberRepository.findOne({
        where: { mem_id: tokenData.mem_id }
      });

      if (!member) {
        return {
          success: false,
          data: null,
          code: 'USER_NOT_FOUND'
        };
      }

      const payload = {
        mem_id: member.mem_id,
        mem_email_id: member.mem_email_id,
        mem_name: member.mem_name,
        center_id: member.center_id,
        mem_app_status: member.mem_app_status
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        success: true,
        data: { access_token: accessToken },
        code: 'SUCCESS'
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        data: null,
        code: 'INTERNAL_SERVER_ERROR'
      };
    }
  }
}
