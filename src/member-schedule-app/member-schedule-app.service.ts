import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { MemberSchedule } from '../entities/member-schedule-app.entity';
import { InsertMemberScheduleAppDto, DeleteMemberScheduleAppDto, UpdateMemberScheduleAppDto } from './dto/member-schedule-app.dto';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';

@Injectable()
export class MemberScheduleAppService {
  constructor(
    @InjectRepository(MemberSchedule)
    private memberScheduleRepository: Repository<MemberSchedule>,
    private dataSource: DataSource
  ) {}

  async getCenterScheduleList(center_id: number): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      // NestJS TypeORM QueryBuilder 사용
      const schedules = await this.dataSource
        .createQueryBuilder()
        .select([
          'sch_id',
          'sch_time',
          'sch_max_cap',
          'sch_info'
        ])
        .from('schedule', 'sch')
        .where('sch.center_id = :center_id', { center_id })
        .andWhere('sch.sch_status = :status', { status: 1 })
        .getRawMany();

      if (!schedules || schedules.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: schedules,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error fetching schedules:', error);
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

  async getMemberScheduleAppList(mem_id: number): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      // NestJS TypeORM QueryBuilder 사용
      const schedules = await this.dataSource
        .createQueryBuilder()
        .select([
          'sch_app_id',
          'mem_id',
          'sch_id',
          'sch_dt',
          'del_yn',
          'reg_dt',
          'reg_id',
          'mod_dt',
          'mod_id',
          `(
            SELECT
              ssch.sch_time
            FROM  schedule ssch
            WHERE ssch.sch_id = msa.sch_id
          ) as sch_time`
        ])
        .from('member_schedule_app', 'msa')
        .where('msa.mem_id = :mem_id', { mem_id })
        .andWhere('msa.del_yn = :del_yn', { del_yn: 'N' })
        .orderBy('msa.sch_app_id', 'DESC')
        .getRawMany();

      if (!schedules || schedules.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: schedules,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error fetching member schedules:', error);
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

  async insertMemberScheduleApp(insertMemberScheduleDto: InsertMemberScheduleAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, sch_id, sch_dt } = insertMemberScheduleDto;
      
      // 현재 시간 (YYYYMMDDHHIISS 형식)
      const currentDate = getCurrentDateYYYYMMDDHHIISS();
      
      // TypeORM QueryBuilder 사용하여 데이터 삽입
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('member_schedule_app')
        .values({
          mem_id: mem_id,
          sch_id: sch_id,
          sch_dt: sch_dt,
          del_yn: 'N',
          reg_dt: currentDate,
          reg_id: mem_id
        })
        .execute();
      
      return {
        success: true,
        message: '스케줄이 성공적으로 등록되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error creating member schedule:', error);
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

  async deleteMemberScheduleApp(deleteMemberScheduleAppDto: DeleteMemberScheduleAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { sch_app_id, mem_id } = deleteMemberScheduleAppDto;
      
      // 현재 시간 (YYYYMMDDHHIISS 형식)
      const currentDate = getCurrentDateYYYYMMDDHHIISS();
      
      // TypeORM QueryBuilder 사용하여 del_yn을 'Y'로 업데이트
      const result = await this.dataSource
        .createQueryBuilder()
        .update('member_schedule_app')
        .set({
          del_yn: 'Y',
          mod_dt: currentDate,
          mod_id: mem_id
        })
        .where('sch_app_id = :sch_app_id', { sch_app_id })
        .execute();
      
      if (result.affected === 0) {
        return {
          success: false,
          message: '삭제할 스케줄을 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }
      
      return {
        success: true,
        message: '스케줄이 성공적으로 삭제되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error deleting member schedule:', error);
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

  async updateMemberScheduleApp(updateMemberScheduleAppDto: UpdateMemberScheduleAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { sch_app_id, sch_id, sch_dt, mem_id } = updateMemberScheduleAppDto;
      
      // 현재 시간 (YYYYMMDDHHIISS 형식)
      const currentDate = getCurrentDateYYYYMMDDHHIISS();
      
      // TypeORM QueryBuilder 사용하여 데이터 업데이트
      const result = await this.dataSource
        .createQueryBuilder()
        .update('member_schedule_app')
        .set({
          sch_id: sch_id,
          sch_dt: sch_dt,
          mod_dt: currentDate,
          mod_id: mem_id
        })
        .where('sch_app_id = :sch_app_id', { sch_app_id })
        .execute();
      
      if (result.affected === 0) {
        return {
          success: false,
          message: '업데이트할 스케줄을 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }
      
      return {
        success: true,
        message: '스케줄이 성공적으로 업데이트되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error updating member schedule:', error);
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