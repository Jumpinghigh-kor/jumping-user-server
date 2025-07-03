import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetNoticesAppListDto {
}

export interface NoticesAppListResponse {
  title: string;
  content: string;
} 