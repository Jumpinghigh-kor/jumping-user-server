import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
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
          'm.center_id'
        ])
        .where('m.mem_email_id = :email', { email })
        .getOne();
        
      if (!member) {
        throw new HttpException('존재하지 않는 이메일입니다.', HttpStatus.BAD_REQUEST);
      }

      // 임시: 비밀번호가 1234인 경우 허용
      if (password === '1234') {
        const { mem_app_password, ...result } = member;
        return result;
      }

      // 비밀번호가 없는 경우
      if (!member.mem_app_password) {
        throw new HttpException('비밀번호가 설정되지 않았습니다.', HttpStatus.BAD_REQUEST);
      }

      try {
        const isMatch = await bcrypt.compare(password, member.mem_app_password);
        if (!isMatch) {
          throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
        }
      } catch (bcryptError) {
        // bcrypt 비교 중 에러가 발생한 경우 (해시되지 않은 비밀번호일 수 있음)
        if (password !== member.mem_app_password) {
          throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
        }
      }

      const { mem_app_password, ...result } = member;
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('validateUser error:', error);
      throw new HttpException('서버 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(user: any) {
    try {
      const payload = { 
        mem_id: user.mem_id,
        mem_email_id: user.mem_email_id,
        mem_name: user.mem_name,
        center_id: user.center_id
      };
      
      const token = this.jwtService.sign(payload);

      return {
        success: true,
        data: {
          access_token: token,
          user: payload
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException('로그인 처리 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
