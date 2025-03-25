import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class InsertMemberExerciseDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsNotEmpty()
  exercise_dt: string;

  @IsNotEmpty()
  exercise_time: string;

  @IsNotEmpty()
  intensity_level: string;

  @IsOptional()
  @Transform(({ value }) => value === undefined || value === null || value === '' ? null : String(value))
  heart_rate?: string | null;

  @IsNotEmpty()
  reg_dt: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  reg_id: number;

  @IsOptional()
  mod_dt?: string;

  @IsOptional()
  @Transform(({ value }) => value === undefined || value === null || value === '' ? null : Number(value))
  mod_id?: number | null;
}

export class UpdateMemberExerciseDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  exercise_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsNotEmpty()
  exercise_time: string;

  @IsNotEmpty()
  intensity_level: string;

  @IsOptional()
  @Transform(({ value }) => value === undefined || value === null || value === '' ? null : String(value))
  heart_rate?: string | null;
}

export class GetMemberExerciseInfoDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsNotEmpty()
  exercise_dt: string;
}

export class GetMemberExerciseListDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsOptional()
  year_month?: string;

  @IsOptional()
  category_dt?: string;

  @IsOptional()
  all_date?: boolean;
}

export interface MemberExerciseInfoResponse {
  exercise_id: number;
  mem_id: number;
  exercise_dt: string;
  exercise_time: string;
  intensity_level: string;
  heart_rate: string;
}

export interface MemberExerciseListResponse {
  exercise_id: number;
  mem_id: number;
  exercise_dt: string;
  exercise_time: string;
  intensity_level: string;
  heart_rate: string;
} 