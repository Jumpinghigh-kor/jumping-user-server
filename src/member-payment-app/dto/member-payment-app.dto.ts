import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberPaymentsDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;

  @IsOptional()
  @Transform(({ value }) => String(value))
  payment_status: string;
}

export interface MemberPaymentAppResponse {
  payment_app_id: number;
  payment_status: string;
  payment_method: string;
  payment_amount: number;
  payment_dt: string;
  portone_imp_uid: string;
  portone_merchant_uid: string;
  portone_status: string;
  card_name: string;
}

export class InsertMemberPaymentAppDto {
  @IsNumber()
  @IsNotEmpty()
  order_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsNumber()
  @IsNotEmpty()
  payment_status: string;

  @IsNumber()
  @IsNotEmpty()
  payment_type: number;

  @IsOptional()
  @IsString()
  payment_method: string;

  @IsNumber()
  @IsNotEmpty()
  payment_amount: number;

  @IsOptional()
  @IsString()
  portone_imp_uid: string;

  @IsOptional()
  @IsString()
  portone_merchant_uid: string;

  @IsString()
  @IsNotEmpty()
  portone_status: string;

  @IsString()
  @IsNotEmpty()
  card_name: string;
} 