import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberExercise } from '../entities/member-exercise.entity';
import { InsertMemberExerciseDto, GetMemberExerciseInfoDto, MemberExerciseInfoResponse, UpdateMemberExerciseDto, GetMemberExerciseListDto, MemberExerciseListResponse } from './dto/member-exercise.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class MemberExerciseService {
  constructor(
    @InjectRepository(MemberExercise)
    private memberExerciseRepository: Repository<MemberExercise>,
    private dataSource: DataSource
  ) {}

  async insertMemberExercise(insertMemberExerciseDto: InsertMemberExerciseDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { 
        mem_id, 
        exercise_dt, 
        exercise_time, 
        intensity_level, 
        heart_rate, 
        reg_dt, 
        reg_id, 
        mod_dt, 
        mod_id 
      } = insertMemberExerciseDto;
      
      // Using the provided SQL query with QueryBuilder
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(MemberExercise)
        .values({
          mem_id,
          exercise_dt,
          exercise_time,
          intensity_level,
          heart_rate: heart_rate === null || heart_rate === undefined ? undefined : heart_rate,
          reg_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          reg_id,
          mod_dt,
          mod_id: mod_id === 0 || mod_id === null || mod_id === undefined ? undefined : mod_id
        })
        .execute();

      return {
        success: true,
        message: '운동 정보가 성공적으로 저장되었습니다.',
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

  async updateMemberExercise(updateMemberExerciseDto: UpdateMemberExerciseDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { 
        exercise_id,
        mem_id,
        exercise_time, 
        intensity_level, 
        heart_rate
      } = updateMemberExerciseDto;

      // 필드 값 설정
      const updateFields = {
        exercise_time,
        intensity_level,
        mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
        mod_id: mem_id
      };
      
      // heart_rate 필드가 null 또는 undefined가 아닌 경우에만 추가
      if (heart_rate !== null && heart_rate !== undefined) {
        updateFields['heart_rate'] = heart_rate;
      } else {
        // 명시적으로 null로 설정
        updateFields['heart_rate'] = null;
      }
      
      // Using the provided SQL query with QueryBuilder
      const result = await this.memberExerciseRepository
        .createQueryBuilder()
        .update(MemberExercise)
        .set(updateFields)
        .where("exercise_id = :exercise_id", { exercise_id })
        .execute();

      if (result.affected === 0) {
        return {
          success: false,
          message: '업데이트할 운동 정보를 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        message: '운동 정보가 성공적으로 업데이트되었습니다.',
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

  async getMemberExerciseInfo(getMemberExerciseInfoDto: GetMemberExerciseInfoDto): Promise<{ success: boolean; data: MemberExerciseInfoResponse | null; code: string }> {
    try {
      const { mem_id, exercise_dt } = getMemberExerciseInfoDto;
      // Using the provided SQL query
      const exerciseInfo = await this.memberExerciseRepository
        .createQueryBuilder('me')
        .select([
          'exercise_id',
          'mem_id',
          'exercise_dt',
          'exercise_time',
          'intensity_level',
          'heart_rate'
        ])
        .where('me.mem_id = :mem_id', { mem_id })
        .andWhere('me.exercise_dt = :exercise_dt', { exercise_dt })
        .getRawOne();

      if (!exerciseInfo) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: exerciseInfo,
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

  async getMemberExerciseList(getMemberExerciseListDto: GetMemberExerciseListDto): Promise<{ success: boolean; data: MemberExerciseListResponse[] | null; code: string }> {
    try {
      const { mem_id, year_month, category_dt } = getMemberExerciseListDto;
      
      // 기본 쿼리 빌더
      const queryBuilder = this.memberExerciseRepository
        .createQueryBuilder('me')
        .select([
          'exercise_id',
          'mem_id',
          'exercise_dt',
          'exercise_time',
          'intensity_level',
          'heart_rate'
        ])
        .where('me.mem_id = :mem_id', { mem_id });
      
      // all_date가 true이면 모든 날짜 데이터 조회 (추가 조건 없음)
      if (year_month === 'all_date') {
        // 모든 날짜 데이터를 조회하므로 추가 조건 없음
      }
      // category_dt에 따라 조건 분기
      else if (category_dt) {
        // 현재 날짜 자동으로 구하기
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 0-11이므로 +1
        const currentDay = now.getDate();
        
        switch(category_dt) {
          case 'day':
            // day는 기본 조건 (year_month로 필터링)
            if (year_month) {
              queryBuilder.andWhere("me.exercise_dt like :exerciseDt", { exerciseDt: `%${year_month}%` });
            }
            break;
            
          case 'week':
            // 현재 달 기준으로 주 단위로 분리
            // MySQL DATE_FORMAT과 WEEK 함수를 사용하여 같은 주에 속하는 날짜 가져오기
            queryBuilder.andWhere(`
              YEAR(STR_TO_DATE(me.exercise_dt, '%Y%m%d')) = :year AND 
              MONTH(STR_TO_DATE(me.exercise_dt, '%Y%m%d')) = :month
            `, { 
              year: currentYear, 
              month: currentMonth
            });
            break;
            
          case 'month':
            // 12개월 모두 가져오기 (현재 연도)
            queryBuilder.andWhere(`
              YEAR(STR_TO_DATE(me.exercise_dt, '%Y%m%d')) = :year
            `, { 
              year: currentYear
            });
            break;
            
          case 'year':
            // 현재 연도부터 5년 전까지 (총 6년)
            const startYear = currentYear - 5; // 5년 전
            const endYear = currentYear; // 현재 연도
            
            queryBuilder.andWhere(`
              SUBSTRING(me.exercise_dt, 1, 4) >= :startYear AND
              SUBSTRING(me.exercise_dt, 1, 4) <= :endYear
            `, { 
              startYear: startYear.toString(),
              endYear: endYear.toString()
            });
            break;
        }
      } else if (year_month) {
        // category_dt가 없고 year_month만 있는 경우 기존 로직 사용
        queryBuilder.andWhere("me.exercise_dt like :exerciseDt", { exerciseDt: `%${year_month}%` });
      }
      
      const exerciseList = await queryBuilder
        .orderBy('me.exercise_dt', 'DESC')
        .getRawMany();

      if (!exerciseList || exerciseList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      // 결과를 category_dt에 맞게 추가 가공
      let processedData = exerciseList;
      
      if (category_dt === 'week' || category_dt === 'month' || category_dt === 'year') {
        // 데이터 그룹화 및 요약 로직을 여기에 추가할 수 있음
        // 예: 주별/월별/연별 합계 또는 평균을 계산
      }

      return {
        success: true,
        data: processedData,
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