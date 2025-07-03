import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class getEventAppListDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  event_app_id: number;
}

export interface EventAppListResponse {
  event_app_id: number;
  title: string;
  event_img_type: string;
  navigation_path: string;
  file_id: string;
  file_name: string;
  file_path: string;
  file_division: string;
} 