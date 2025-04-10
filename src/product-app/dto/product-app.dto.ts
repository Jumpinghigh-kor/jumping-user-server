import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetProductAppListDto {
  @IsOptional()
  @IsString()
  big_category?: string;
}

export interface ProductAppListResponse {
  product_app_id: number;
  product_app_type: string;
  title: string;
  price: number;
  original_price: number;
  discount: number;
  give_point: number;
  sell_start_dt: string;
  sell_end_dt: string;
  view_yn: string;
  del_yn: string;
  reg_dt: string;
  reg_id: string;
  mod_dt: string;
  mod_id: string;
}

export class GetProductAppImgDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  product_app_id: number;
}

export interface ProductAppImgDetailResponse {
  file_name: string;
  file_division: string;
  file_path: string;
  img_form: string;
  order_seq: number;
}

export class SelectProductAppThumbnailImgDto {

}

export interface ProductAppThumbnailImgResponse {
  file_name: string;
  file_division: string;
  file_path: string;
  img_form: string;
  order_seq: number;
}