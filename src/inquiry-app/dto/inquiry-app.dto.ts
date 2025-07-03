import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetInquiryAppListDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}

export class InsertInquiryAppDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}

export class UpdateInquiryAppDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  inquiry_app_id: number;

  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  mem_id?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  mod_id?: number;
}

export class DeleteInquiryAppDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  inquiry_app_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}

export interface InquiryAppListResponse {
  title: string;
  content: string;
  inquiry_app_id: number;
  reg_dt: string;
} 