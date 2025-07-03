import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetMemberAlarmAppDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsOptional()
  push_yn?: string;

  @IsOptional()
  push_token?: string;
} 

export class MemberAlarmAppListResponse {
  alarm_app_id: number;
  mem_id: number;
  push_yn: string;
  push_token: string;
  reg_dt: string;
  reg_id: number;
  mod_dt: string;
  mod_id: number;
} 

export class UpdateMemberAlarmAppDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  member_alarm_app_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  alarm_app_id: number;

  @IsOptional()
  use_yn: string;
} 