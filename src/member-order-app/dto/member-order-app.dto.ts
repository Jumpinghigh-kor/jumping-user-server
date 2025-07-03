import { IsNotEmpty, IsOptional } from 'class-validator';
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
} 