import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberInfoDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}

export interface MemberInfoResponse {
  mem_id: number;
  mem_name: string;
  mem_phone: string;
  mem_birth: string;
  mem_gender: string;
  mem_checkin_number: string;
  mem_manager: string;
  mem_sch_id: number;
  mem_email_id: string;
  mem_app_status: number;
  center_id: number;
} 