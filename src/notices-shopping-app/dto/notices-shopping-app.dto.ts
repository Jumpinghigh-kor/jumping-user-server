import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetNoticesShoppingAppListDto {
  @IsOptional()
  @IsString()
  notices_type?: string;
}

export interface NoticesShoppingAppListResponse {
  notices_type: string;
  content: string;
  notices_shopping_app_id: number;
  reg_dt: string;
  start_dt: string;
  end_dt: string;
} 