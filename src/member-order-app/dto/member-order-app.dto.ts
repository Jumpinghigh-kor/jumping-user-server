import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberOrdersDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsOptional()
  @Transform(({ value }) => String(value))
  screen_type: string;

  @IsOptional()
  @Transform(({ value }) => String(value))
  year: string;
} 

export interface MemberOrderAppResponse {
  product_app_id: number;
  brand_name: string;
  product_name: string;
  product_title: string;
  order_quantity: number;
  order_price: number;
  option_amount: number;
  option_type: string;
  order_dt: string;
  delivery_fee: number;
  free_shipping_amount: number;
  inquiry_phone_number: string;
  today_send_yn: string;
  today_send_time: string;
  not_today_send_day: string;
  courier_code: string;
  review_yn: string;
  return_app_id: number;
  del_yn: string;
  order_group: number;
}

export class InsertMemberOrderAppDto {
  @IsNumber()
  @IsNotEmpty()
  mem_id: number;
}

export class InsertMemberOrderDetailAppDto {
  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsNumber()
  @IsNotEmpty()
  order_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_detail_app_id: number;

  @IsString()
  @IsNotEmpty()
  order_status: string;

  @IsNumber()
  @IsNotEmpty()
  order_quantity: number;

  @IsNumber()
  @IsNotEmpty()
  order_group: number;
}

export class UpdateOrderStatusDto {
  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  order_detail_app_ids: number[];

  @IsNumber()
  @IsOptional()
  order_group?: number;

  @IsString()
  @IsNotEmpty()
  order_status: string;
}

export class UpdateOrderQuantityDto {
  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsNumber()
  @IsNotEmpty()
  order_detail_app_id: number[];

  @IsNumber()
  @IsNotEmpty()
  order_quantity: number;
}

export class UpdateMemberOrderDetailAppDto {
  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  order_detail_app_ids: number[];

  @IsString()
  @IsNotEmpty()
  courier_code: string;

  @IsString()
  @IsNotEmpty()
  tracking_number: string;
  
  @IsString()
  @IsNotEmpty()
  goodsflow_id: string;

  @IsString()
  @IsOptional()
  purchase_confirm_dt: string;
}