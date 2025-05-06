import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberOrdersDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsOptional()
  @Transform(({ value }) => String(value))
  screen_type: string;
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
  review_yn: string;
} 