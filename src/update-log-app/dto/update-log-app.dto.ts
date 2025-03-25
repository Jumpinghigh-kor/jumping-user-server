import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateLogAppDto {
}

export interface UpdateLogAppResponse {
}

export interface UpdateLogAppInfo {
  up_app_id: number;
  up_app_version: string;
  up_app_desc: string;
  reg_dt: Date;
} 