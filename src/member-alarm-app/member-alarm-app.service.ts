import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberAlarmApp } from '../entities/member-alarm-app.entity';
import { MemberAlarmAppListResponse } from './dto/member-alarm-app.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class MemberAlarmAppService {
  constructor(
    @InjectRepository(MemberAlarmApp)
    private memberAlarmAppRepository: Repository<MemberAlarmApp>,
    private dataSource: DataSource
  ) {}
  
  async getMemberAlarmAppList(getMemberAlarmAppDto: any): Promise<{ success: boolean; data: MemberAlarmAppListResponse[] | null; code: string }> {
    try {
      const { mem_id } = getMemberAlarmAppDto;
      
      let queryBuilder = await this.dataSource
        .createQueryBuilder()
        .select([
          'alarm_app_id'
          , 'mem_id'
          , 'push_yn'
          , 'push_token'
        ])
        .from('member_alarm_app', 'mca')
        .where('mem_id = :mem_id', { mem_id })
        .getRawOne();

      return {
        success: true,
        data: queryBuilder,
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

  async insertMemberAlarmApp(alarmData: any): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, push_token, push_yn } = alarmData;

      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('member_alarm_app')
        .values({
          mem_id: mem_id,
          push_yn: push_yn,
          push_token: push_token,
          reg_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          reg_id: mem_id,
          mod_dt: null,
          mod_id: null
        })
        .execute();
  
      return {
        success: true,
        message: '쿠폰이 지급되었습니다.',
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


  async updatePushToken(mem_id: number, push_token: string): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const result = await this.memberAlarmAppRepository
        .createQueryBuilder()
        .update('member_alarm_app')
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
      const result = await this.memberAlarmAppRepository
        .createQueryBuilder()
        .update('member_alarm_app')
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
} 