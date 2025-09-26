import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetInquiryShoppingAppListDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}

export class InquiryShoppingAppDto {
  @IsNumber()
  @IsNotEmpty()
  inquiry_shopping_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsString()
  @IsOptional()
  inquiry_type: string;
  
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  answer: string;

  @IsString()
  @IsOptional()
  answer_dt: string;

  @IsString()
  @IsOptional()
  del_yn: string;

  @IsString()
  @IsOptional()
  reg_dt: string;

  @IsNumber()
  @IsOptional()
  reg_id: number;

  @IsString()
  @IsOptional()
  mod_dt: string;

  @IsNumber()
  @IsOptional()
  mod_id: number;
}

export class InsertInquiryShoppingAppDto {
  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsString()
  @IsNotEmpty()
  inquiry_type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export interface InquiryShoppingAppListResponse {
  title: string;
  content: string;
  inquiry_app_id: number;
  reg_dt: string;
}

export class UpdateInquiryShoppingAppDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  inquiry_shopping_app_id: number;

  @IsOptional()
  inquiry_type: string;

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

export class DeleteInquiryShoppingAppDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  inquiry_shopping_app_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}