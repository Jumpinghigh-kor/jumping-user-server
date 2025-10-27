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

  @IsNumber()
  @IsNotEmpty()
  product_app_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

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
  product_app_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export interface InquiryShoppingAppListResponse {
  content: string;
  inquiry_shopping_app_id: number;
  reg_dt: string;
}

export class UpdateInquiryShoppingAppDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  inquiry_shopping_app_id: number;

  @IsNotEmpty()
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