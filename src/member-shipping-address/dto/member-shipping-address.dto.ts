import { IsNotEmpty, IsNumber, IsString, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberShippingAddressListDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  shipping_address_id?: number;
}

export class InsertMemberShippingAddressDto {
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  mem_id: number;

  @IsString()
  shipping_address_name: string;

  @IsString()
  receiver_name: string;

  @IsString()
  receiver_phone: string;

  @IsString()
  @IsIn(['Y', 'N'])
  default_yn: string;

  @IsOptional()
  @IsString()
  select_yn?: string;

  @IsString()
  address: string;

  @IsString()
  address_detail: string;

  @IsString()
  zip_code: string;

  @IsOptional()
  @IsString()
  enter_way?: string;

  @IsOptional()
  @IsString()
  enter_memo?: string;
  
  @IsOptional()
  @IsString()
  delivery_request?: string;
}

export class UpdateMemberShippingAddressDto {
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  shipping_address_id: number;

  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  mem_id: number;

  @IsString()
  shipping_address_name: string;

  @IsString()
  receiver_name: string;

  @IsString()
  receiver_phone: string;

  @IsString()
  @IsIn(['Y', 'N'])
  default_yn: string;

  @IsOptional()
  @IsString()
  select_yn?: string;

  @IsString()
  address: string;

  @IsString()
  address_detail: string;

  @IsString()
  zip_code: string;

  @IsOptional()
  @IsString()
  enter_way?: string;

  @IsOptional()
  @IsString()
  enter_memo?: string;
  
  @IsOptional()
  @IsString()
  delivery_request?: string;
}

export class DeleteMemberShippingAddressDto {
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  shipping_address_id: number;

  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  mem_id: number;
}

export class UpdateDeliveryRequestDto {
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  shipping_address_id: number;

  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  mem_id: number;

  @IsString()
  delivery_request: string;
}

export class UpdateSelectYnDto {
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsOptional()
  shipping_address_id: number;

  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  mem_id: number;

  @IsString()
  select_yn: string;
}

export interface MemberShippingAddressResponse {
  // 응답 데이터 인터페이스 정의 예정
} 