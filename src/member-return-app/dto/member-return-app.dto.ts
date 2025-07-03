import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate, IsArray } from 'class-validator';

export class MemberReturnAppDto {
  @IsNumber()
  @IsNotEmpty()
  return_app_id: number;

  @IsString()
  @IsNotEmpty()
  order_app_id: number;

  @IsString()
  @IsNotEmpty()
  mem_id: number;

  @IsString()
  @IsNotEmpty()
  return_type: string;

  @IsString()
  @IsOptional()
  return_status: string;

  @IsString()
  @IsOptional()
  reason: string;

  @IsString()
  @IsOptional()
  admin_reason: string;

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
  order_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  shipping_address_id: number;

  @IsString()
  @IsNotEmpty()
  mem_id: string;

  @IsString()
  @IsNotEmpty()
  return_type: string;

  @IsString()
  @IsOptional()
  reason: string;

  @IsArray()
  @IsOptional()
  file_ids?: number[];
}

export class DeleteMemberReturnAppDto {
  @IsString()
  @IsNotEmpty()
  mem_id: string;

  @IsNumber()
  @IsNotEmpty()
  return_app_id: number;
}