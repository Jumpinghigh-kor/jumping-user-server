import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MemberExercise } from '../entities/member-exercise.entity';
import { InsertMemberExerciseDto, GetMemberExerciseInfoDto, MemberExerciseInfoResponse, UpdateMemberExerciseDto } from './dto/member-exercise.dto';
import { COMMON_RESPONSE_CODES } from '../common/constants/response-codes';

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
          heart_rate,
          reg_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          reg_id,
          mod_dt,
          mod_id
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

      // Using the provided SQL query with QueryBuilder
      const result = await this.memberExerciseRepository
        .createQueryBuilder()
        .update(MemberExercise)
        .set({
          exercise_time,
          intensity_level,
          heart_rate,
          mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          mod_id: mem_id
        })
        .where("id = :exercise_id", { exercise_id })
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
} 