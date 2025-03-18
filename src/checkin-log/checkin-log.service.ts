import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CheckinLog } from '../entities/checkin-log.entity';
import { Member } from '../entities/member.entity';
import { InsertCheckinLogDto, GetCheckinLogListDto, CheckinLogResponse, ValidateMemberNumberDto } from './dto/checkin-log.dto';
import { COMMON_RESPONSE_CODES, CHECKIN_RESPONSE_CODES } from '../common/constants/response-codes';
import { Brackets } from 'typeorm';

@Injectable()
export class CheckinLogService {
  constructor(
    @InjectRepository(CheckinLog)
    private checkinLogRepository: Repository<CheckinLog>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private dataSource: DataSource
  ) {}

  // 회원 번호 검증
  async validateMemberNumber(validateMemberNumberDto: ValidateMemberNumberDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, mem_checkin_number } = validateMemberNumberDto;
      
      const memberCount = await this.memberRepository
        .createQueryBuilder('m')
        .select('COUNT(*)', 'chk_num_cnt')
        .where('m.mem_id = :mem_id', { mem_id })
        .andWhere('m.mem_checkin_number = :mem_checkin_number', { mem_checkin_number })
        .getRawOne();

      if (memberCount.chk_num_cnt === '0') {
        return {
          success: false,
          message: '일치하는 회원이 없습니다.',
          code: CHECKIN_RESPONSE_CODES.MEMBER_NOT_FOUND
        };
      }

      return {
        success: true,
        message: '회원 번호가 확인되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      return {
        success: false,
        message: '회원 번호 확인 중 오류가 발생했습니다.',
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }

  // 체크인 생성
  async insertCheckinLog(insertCheckinLogDto: InsertCheckinLogDto): Promise<{ success: boolean; message: string; code: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { center_id, mem_id, pro_type, memo_id } = insertCheckinLogDto;
      
      // 체크인 로그 생성
      const checkinLog = new CheckinLog();
      checkinLog.ci_mem_id = mem_id;
      checkinLog.ci_date = new Date();
      checkinLog.center_id = center_id;

      await queryRunner.manager.save(checkinLog);

      // 회차권인 경우 잔여 횟수 감소
      if (pro_type === '회차권') {
        await queryRunner.manager.query(
          'UPDATE member_orders SET memo_remaining_counts = memo_remaining_counts - 1 WHERE memo_id = ?',
          [memo_id]
        );
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: '체크인이 완료되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: '체크인 처리 중 오류가 발생했습니다.',
        code: COMMON_RESPONSE_CODES.FAIL
      };
    } finally {
      await queryRunner.release();
    }
  }

  // 특정 회원의 체크인 기록 조회
  async getCheckinLogList(getCheckinLogListDto: GetCheckinLogListDto): Promise<{ success: boolean; data: CheckinLogResponse[]; code: string }> {
    try {
      const { mem_id, year, month } = getCheckinLogListDto;
      
      const queryBuilder = this.checkinLogRepository
        .createQueryBuilder('checkin_log')
        .select([
          "DATE_FORMAT(checkin_log.ci_date, '%Y-%m-%d') AS ci_date_only",
          "DATE_FORMAT(checkin_log.ci_date, '%H:%i:%s') AS ci_time_only"
        ])
        .where('checkin_log.ci_mem_id = :mem_id', { mem_id: Number(mem_id) })
        .andWhere("DATE_FORMAT(checkin_log.ci_date, '%Y') = :year", { year: String(year) })
        .andWhere("DATE_FORMAT(checkin_log.ci_date, '%m') = :month", { month: String(month).padStart(2, '0') });

      const checkins = await queryBuilder.getRawMany();

      return {
        success: true,
        data: checkins || [],
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }
} 