import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate, IsArray } from 'class-validator';

export class MemberReturnAppDto {
  @IsNumber()
  @IsNotEmpty()
  return_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  order_detail_app_id: number;

  @IsNumber()
  @IsOptional()
  order_address_id: number;

  @IsString()
  @IsNotEmpty()
  mem_id: number;

  @IsString()
  @IsNotEmpty()
  return_applicator: string;

  @IsString()
  @IsOptional()
  return_reason_type: string;

  @IsString()
  @IsOptional()
  reason: string;

  @IsString()
  @IsOptional()
  customer_tracking_number: string;

  @IsString()
  @IsOptional()
  company_tracking_number: string;

  @IsString()
  @IsOptional()
  customer_courier_code: string;

  @IsString()
  @IsOptional()
  company_courier_code: string;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  return_goodsflow_id: number;

  @IsString()
  @IsOptional()
  approval_yn: string;

  @IsString()
  @IsOptional()
  cancel_yn: string;

  @IsString()
  @IsNotEmpty()
  reg_dt: string;

  @IsString()
  @IsNotEmpty()
  reg_id: number;

  @IsString()
  @IsOptional()
  mod_dt: string;

  @IsString()
  @IsOptional()
  mod_id: number;
}

export class GetMemberReturnAppDto {
  @IsString()
  @IsNotEmpty()
  mem_id: string;
}

export class InsertMemberReturnAppDto {
  @IsNumber()
  @IsNotEmpty()
  order_detail_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  order_address_id: number;

  @IsString()
  @IsNotEmpty()
  mem_id: string;

  @IsString()
  @IsNotEmpty()
  return_applicator: string;

  @IsString()
  @IsOptional()
  return_reason_type: string;

  @IsString()
  @IsOptional()
  reason: string;

  @IsArray()
  @IsOptional()
  file_ids?: number[];
}

export class CancelMemberReturnAppDto {
  @IsString()
  @IsNotEmpty()
  mem_id: string;

  @IsArray()
  @IsNotEmpty()
  order_detail_app_ids: number[];
}

export class UpdateMemberReturnAppDto {
  @IsString()
  @IsNotEmpty()
  mem_id: string;

  @IsArray()
  @IsNotEmpty()
  order_detail_app_ids: number[];

  @IsString()
  @IsNotEmpty()
  cancel_yn: string;

  @IsString()
  @IsOptional()
  return_reason_type: string;

  @IsString()
  @IsOptional()
  reason: string;
}