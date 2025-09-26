import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface MemberOrderAddressResponse {
  mem_id: number;
  order_address_id: number;
  receiver_name: string;
  receiver_phone: string;
  address: string;
  address_detail: string;
  zip_code: string;
  enter_way: string;
  enter_memo: string;
  delivery_request: string;
}

export class InsertMemberOrderAddressDto {
  @IsNumber()
  @IsNotEmpty()
  order_detail_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsString()
  @IsOptional()
  order_address_type: string;

  @IsString()
  @IsNotEmpty()
  receiver_name: string;

  @IsString()
  @IsNotEmpty()
  receiver_phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  address_detail: string;

  @IsNumber()
  @IsNotEmpty()
  zip_code: string;

  @IsOptional()
  @IsString()
  enter_way: string;

  @IsOptional()
  @IsString()
  enter_memo: string;

  @IsOptional()
  @IsString()
  delivery_request: string;
} 