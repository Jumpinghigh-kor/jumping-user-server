import { IsNotEmpty, IsNumberString, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ValidateMemberNumberDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsNotEmpty()
  mem_checkin_number: string;
}

export class InsertCheckinLogDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  center_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsOptional()
  pro_type?: string;

  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : null)
  memo_id?: number;
}

export class GetCheckinLogListDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  year: string;

  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  month: string;
}

export interface CheckinLogResponse {
  ci_date_only: string;
  ci_time_only: string;
} 