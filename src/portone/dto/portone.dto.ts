import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  imp_uid: string;
}

export class CancelPaymentDto {
  @IsNotEmpty()
  @IsString()
  imp_uid: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class WebhookDto {
  @IsNotEmpty()
  @IsString()
  imp_uid: string;

  @IsNotEmpty()
  @IsString()
  merchant_uid: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  amount?: number;

  @IsOptional()
  fail_reason?: string;
} 